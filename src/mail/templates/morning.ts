export function renderMorningDigest(date: string, sections: Array<{ label: string; items: Array<{ title: string; summary: string; sourceUrl: string; sourceName: string }> }>, flashes?: Array<{ title: string; sourceName: string; sourceUrl: string }>): string {
  let itemsHtml = '';
  let counter = 1;

  for (const section of sections) {
    if (section.items.length === 0) continue;
    itemsHtml += `<h3 style="background:#1a1a2e;color:#fff;padding:8px 14px;border-radius:4px;margin:20px 0 10px;font-size:15px;">${section.label}</h3>`;
    for (const item of section.items) {
      itemsHtml += `
        <div style="margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid #eee;">
          <div style="font-size:13px;color:#888;margin-bottom:2px;">${counter}.</div>
          <a href="${item.sourceUrl}" style="font-size:15px;font-weight:600;color:#1a73e8;text-decoration:none;">${item.title}</a>
          <div style="font-size:12px;color:#999;margin-top:2px;">${item.sourceName}</div>
          ${item.summary ? `<div style="font-size:13px;color:#555;margin-top:6px;line-height:1.5;">${item.summary}</div>` : ''}
        </div>`;
      counter++;
    }
  }

  if (flashes && flashes.length > 0) {
    itemsHtml += `<h3 style="background:#1a1a2e;color:#fff;padding:8px 14px;border-radius:4px;margin:20px 0 10px;font-size:15px;">快讯</h3>`;
    for (const flash of flashes) {
      itemsHtml += `
        <div style="margin-bottom:8px;font-size:13px;color:#555;">
          • <a href="${flash.sourceUrl}" style="color:#1a73e8;text-decoration:none;">${flash.title}</a>
          <span style="color:#999;"> — ${flash.sourceName}</span>
        </div>`;
    }
  }

  return buildHtml(`AI HOT 早报 | ${date}`, itemsHtml);
}

function buildHtml(subject: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;margin:20px 0;border-radius:8px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:24px 30px;">
        <h1 style="color:#fff;font-size:22px;margin:0;">AI <span style="color:#e94560;">HOT</span> 早报</h1>
        <p style="color:#aaa;font-size:13px;margin:4px 0 0;">每日 AI 资讯精选</p>
      </td></tr>
      <tr><td style="padding:20px 30px;">
        ${bodyHtml}
      </td></tr>
      <tr><td style="background:#fafafa;padding:16px 30px;text-align:center;font-size:12px;color:#999;border-top:1px solid #eee;">
        数据来源 <a href="https://aihot.virxact.com" style="color:#777;">aihot.virxact.com</a>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
