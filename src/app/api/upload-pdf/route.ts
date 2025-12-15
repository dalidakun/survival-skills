import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

// 七牛云配置（推荐国内用户）
const QINIU_ACCESS_KEY = process.env.QINIU_ACCESS_KEY || "";
const QINIU_SECRET_KEY = process.env.QINIU_SECRET_KEY || "";
const QINIU_BUCKET_NAME = process.env.QINIU_BUCKET_NAME || "";
const QINIU_DOMAIN = process.env.QINIU_DOMAIN || "";

// Cloudflare R2 配置（备选方案）
const R2_ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "";
const R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";

// GitHub 配置（备选方案）
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "dalidakun";
const GITHUB_REPO = process.env.GITHUB_REPO || "survival-skills";

/**
 * 上传文件到七牛云
 */
async function uploadToQiniu(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
  if (!QINIU_ACCESS_KEY || !QINIU_SECRET_KEY || !QINIU_BUCKET_NAME) {
    throw new Error("七牛云配置不完整，请在 Vercel 环境变量中配置 QINIU 相关变量");
  }

  // 生成上传凭证
  const crypto = await import("crypto");
  const putPolicy = {
    scope: QINIU_BUCKET_NAME,
    deadline: Math.floor(Date.now() / 1000) + 3600, // 1小时后过期
  };
  const encodedPutPolicy = Buffer.from(JSON.stringify(putPolicy)).toString("base64url");
  const sign = crypto.createHmac("sha1", QINIU_SECRET_KEY).update(encodedPutPolicy).digest("base64url");
  const uploadToken = `${QINIU_ACCESS_KEY}:${sign}:${encodedPutPolicy}`;

  // 上传文件
  const uploadUrl = "https://upload.qiniup.com"; // 华东区域，可根据需要修改
  
  // 使用 multipart/form-data 格式上传
  const boundary = `----WebKitFormBoundary${Date.now()}`;
  const parts: Buffer[] = [];
  
  // 添加文件字段
  parts.push(Buffer.from(`--${boundary}\r\n`));
  parts.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${fileName}"\r\n`));
  parts.push(Buffer.from(`Content-Type: ${contentType}\r\n\r\n`));
  parts.push(fileBuffer);
  parts.push(Buffer.from(`\r\n`));
  
  // 添加 key 字段
  parts.push(Buffer.from(`--${boundary}\r\n`));
  parts.push(Buffer.from(`Content-Disposition: form-data; name="key"\r\n\r\n`));
  parts.push(Buffer.from(fileName));
  parts.push(Buffer.from(`\r\n`));
  
  // 添加 token 字段
  parts.push(Buffer.from(`--${boundary}\r\n`));
  parts.push(Buffer.from(`Content-Disposition: form-data; name="token"\r\n\r\n`));
  parts.push(Buffer.from(uploadToken));
  parts.push(Buffer.from(`\r\n`));
  
  // 结束边界
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  
  const formDataBuffer = Buffer.concat(parts);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body: formDataBuffer,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`七牛云上传失败: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(`七牛云上传失败: ${result.error}`);
  }

  // 返回公开访问 URL
  if (QINIU_DOMAIN) {
    // 确保域名以 http:// 或 https:// 开头
    const domain = QINIU_DOMAIN.endsWith("/") ? QINIU_DOMAIN.slice(0, -1) : QINIU_DOMAIN;
    return `${domain}/${fileName}`;
  }
  
  // 如果没有配置域名，使用默认格式（需要从空间设置中获取）
  throw new Error("请配置 QINIU_DOMAIN 环境变量");
}

/**
 * 上传文件到 Cloudflare R2
 * 使用 AWS S3 兼容 API
 */
async function uploadToR2(fileName: string, fileBuffer: Buffer, contentType: string): Promise<string> {
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    throw new Error("Cloudflare R2 配置不完整，请在 Vercel 环境变量中配置 R2 相关变量");
  }

  // 使用 AWS S3 兼容 API 上传到 R2
  const endpoint = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  const url = `${endpoint}/${R2_BUCKET_NAME}/${fileName}`;
  
  // 生成 AWS Signature Version 4
  const crypto = await import("crypto");
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const amzDate = now.toISOString().slice(0, 19).replace(/[:-]/g, "").replace(".", "") + "Z";
  
  // 计算签名
  const canonicalUri = `/${R2_BUCKET_NAME}/${fileName}`;
  const canonicalQuerystring = "";
  const canonicalHeaders = `host:${R2_ACCOUNT_ID}.r2.cloudflarestorage.com\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-date";
  const payloadHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
  const canonicalRequest = `PUT\n${canonicalUri}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;
  
  const kDate = crypto.createHmac("sha256", `AWS4${R2_SECRET_ACCESS_KEY}`).update(dateStamp).digest();
  const kRegion = crypto.createHmac("sha256", kDate).update("auto").digest();
  const kService = crypto.createHmac("sha256", kRegion).update("s3").digest();
  const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");
  
  const authorization = `${algorithm} Credential=${R2_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "x-amz-date": amzDate,
      "Authorization": authorization,
    },
    body: new Uint8Array(fileBuffer),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`R2 上传失败: ${response.status} ${errorText}`);
  }

  // 返回公开访问 URL
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${fileName}`;
  }
  // 如果没有配置公开 URL，使用默认格式
  return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${fileName}`;
}

/**
 * 上传到 GitHub（备选方案）
 */
async function uploadToGitHub(fileName: string, fileBuffer: Buffer): Promise<string> {
  if (!GITHUB_TOKEN) {
    throw new Error("GitHub Token 未配置");
  }

  const filePath = `public/pdfs/${fileName}`;
  const checkResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    }
  );

  let sha: string | undefined;
  if (checkResponse.ok) {
    const data = await checkResponse.json();
    sha = data.sha;
  } else if (checkResponse.status === 403) {
    const errorText = await checkResponse.text();
    throw new Error(`GitHub 权限不足 (403): ${errorText || "请检查 GitHub Token 是否有 repo 权限"}`);
  } else if (checkResponse.status !== 404) {
    const errorText = await checkResponse.text();
    throw new Error(`检查文件失败 (${checkResponse.status}): ${errorText || checkResponse.statusText}`);
  }

  const body = {
    message: `Upload PDF: ${fileName}`,
    content: fileBuffer.toString("base64"),
    ...(sha && { sha }),
  };

  const createResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!createResponse.ok) {
    let errorMessage = "提交到 GitHub 失败";
    try {
      const error = await createResponse.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // 如果响应不是 JSON，读取文本
      const errorText = await createResponse.text();
      if (createResponse.status === 403) {
        errorMessage = `GitHub 权限不足 (403): ${errorText || "请检查 GitHub Token 是否有 repo 权限"}`;
      } else {
        errorMessage = `GitHub 上传失败 (${createResponse.status}): ${errorText || createResponse.statusText}`;
      }
    }
    throw new Error(errorMessage);
  }

  return `/pdfs/${fileName}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const password = formData.get("password");
    const pdfFile = formData.get("pdf") as File | null;

    // 验证密码
    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: "密码错误" }, { status: 401 });
    }

    // 验证文件
    if (!pdfFile || pdfFile.type !== "application/pdf") {
      return NextResponse.json(
        { message: "请上传 PDF 文件" },
        { status: 400 }
      );
    }

    // 检查文件大小
    // GitHub API 限制：base64 编码后约 100MB，实际文件建议 < 10MB
    // 其他存储服务（R2/七牛云）支持更大的文件
    const maxSizeForGitHub = 10 * 1024 * 1024; // 10MB（GitHub 推荐）
    const maxSizeForOthers = 100 * 1024 * 1024; // 100MB（其他存储服务）
    
    if (pdfFile.size > maxSizeForOthers) {
      return NextResponse.json(
        { message: "文件大小不能超过 100MB" },
        { status: 400 }
      );
    }

    // 生成文件名（使用时间戳避免冲突）
    const timestamp = Date.now();
    const originalName = pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${originalName}`;
    
    // 读取 PDF 文件内容
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    
    let pdfUrl: string;
    let message: string;

    // 优先使用七牛云（推荐国内用户），如果未配置则尝试其他方案
    if (QINIU_ACCESS_KEY && QINIU_SECRET_KEY && QINIU_BUCKET_NAME && QINIU_DOMAIN) {
      try {
        pdfUrl = await uploadToQiniu(fileName, pdfBuffer, "application/pdf");
        message = "上传成功！PDF 已保存到七牛云，链接永久有效。";
      } catch (error) {
        console.error("七牛云上传失败，尝试使用其他方案:", error);
        // 如果七牛云上传失败，尝试 R2
        if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME) {
          try {
            pdfUrl = await uploadToR2(fileName, pdfBuffer, "application/pdf");
            message = "上传成功！PDF 已保存到 Cloudflare R2，链接永久有效。";
          } catch (r2Error) {
            console.error("R2 上传失败，尝试使用 GitHub:", r2Error);
            // 如果 R2 也失败，尝试 GitHub（仅小文件）
            if (GITHUB_TOKEN && pdfFile.size <= maxSizeForGitHub) {
              try {
                pdfUrl = await uploadToGitHub(fileName, pdfBuffer);
                message = "上传成功！PDF 已提交到 GitHub，Vercel 会自动重新部署（约 1-2 分钟）。";
              } catch (ghError) {
                throw new Error("所有存储服务都失败。如果文件 > 10MB，请配置 Cloudflare R2 或七牛云。");
              }
            } else {
              throw new Error("文件太大或 GitHub 未配置。请配置 Cloudflare R2 或七牛云存储。");
            }
          }
        } else if (GITHUB_TOKEN && pdfFile.size <= maxSizeForGitHub) {
          // 直接使用 GitHub（仅小文件）
          try {
            pdfUrl = await uploadToGitHub(fileName, pdfBuffer);
            message = "上传成功！PDF 已提交到 GitHub，Vercel 会自动重新部署（约 1-2 分钟）。";
          } catch (ghError) {
            throw new Error("GitHub 上传失败。如果文件 > 10MB，请配置 Cloudflare R2 或七牛云。");
          }
        } else {
          throw new Error("所有存储服务都未配置");
        }
      }
    } else if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME) {
      // 使用 Cloudflare R2
      try {
        pdfUrl = await uploadToR2(fileName, pdfBuffer, "application/pdf");
        message = "上传成功！PDF 已保存到 Cloudflare R2，链接永久有效。";
      } catch (error) {
        console.error("R2 上传失败，尝试使用 GitHub:", error);
        if (GITHUB_TOKEN && pdfFile.size <= maxSizeForGitHub) {
          try {
            pdfUrl = await uploadToGitHub(fileName, pdfBuffer);
            message = "上传成功！PDF 已提交到 GitHub，Vercel 会自动重新部署（约 1-2 分钟）。";
          } catch (ghError) {
            throw new Error("R2 和 GitHub 上传都失败。如果文件 > 10MB，请检查 R2 配置或压缩文件。");
          }
        } else {
          throw new Error(`R2 上传失败。${pdfFile.size > maxSizeForGitHub ? '文件太大，GitHub 不支持。' : 'GitHub Token 未配置。'}请检查 R2 配置。`);
        }
      }
    } else if (GITHUB_TOKEN) {
      // 使用 GitHub 作为备选方案（仅适用于小文件）
      if (pdfFile.size > maxSizeForGitHub) {
        return NextResponse.json(
          { 
            message: `文件太大（${(pdfFile.size / 1024 / 1024).toFixed(1)}MB）。GitHub 仅支持 < 10MB 的文件。请压缩 PDF 或配置 Cloudflare R2/七牛云存储。` 
          },
          { status: 400 }
        );
      }
      pdfUrl = await uploadToGitHub(fileName, pdfBuffer);
      message = "上传成功！PDF 已提交到 GitHub，Vercel 会自动重新部署（约 1-2 分钟）。";
    } else {
      return NextResponse.json(
        { message: "存储服务未配置。请配置七牛云、Cloudflare R2 或 GitHub Token。" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message,
      url: pdfUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("PDF 上传错误:", error);
    const message =
      error instanceof Error ? error.message : "上传失败，请稍后再试";
    return NextResponse.json({ message }, { status: 500 });
  }
}

