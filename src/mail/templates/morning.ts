export function renderMorningDigest(date: string, sections: Array<{ label: string; items: Array<{ title: string; summary: string; sourceUrl: string; sourceName: string }> }>, flashes?: Array<{ title: string; sourceName: string; sourceUrl: string }>): string {
  let itemsHtml = '';
  let counter = 1;

  for (const section of sections) {
    if (section.items.length === 0) continue;
    itemsHtml += `<h3 style="background:#1a1a2e;color:#fff;padding:10px 16px;border-radius:4px;margin:24px 0 14px;font-size:17px;">${section.label}</h3>`;
    for (const item of section.items) {
      itemsHtml += `
        <div style="margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid #eee;">
          <div style="font-size:15px;color:#888;margin-bottom:4px;">${counter}.</div>
          <a href="${item.sourceUrl}" style="font-size:17px;font-weight:600;color:#1a73e8;text-decoration:none;line-height:1.4;">${item.title}</a>
          <div style="font-size:14px;color:#999;margin-top:4px;">${item.sourceName}</div>
          ${item.summary ? `<div style="font-size:15px;color:#555;margin-top:8px;line-height:1.6;">${item.summary}</div>` : ''}
        </div>`;
      counter++;
    }
  }

  if (flashes && flashes.length > 0) {
    itemsHtml += `<h3 style="background:#1a1a2e;color:#fff;padding:10px 16px;border-radius:4px;margin:24px 0 14px;font-size:17px;">快讯</h3>`;
    for (const flash of flashes) {
      itemsHtml += `
        <div style="margin-bottom:10px;font-size:15px;color:#555;line-height:1.5;">
          • <a href="${flash.sourceUrl}" style="color:#1a73e8;text-decoration:none;font-size:15px;">${flash.title}</a>
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
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#fff;margin:20px 0;border-radius:8px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:28px 32px;">
        <h1 style="color:#fff;font-size:26px;margin:0;">AI <span style="color:#e94560;">HOT</span> 早报</h1>
        <p style="color:#aaa;font-size:15px;margin:6px 0 0;">每日 AI 资讯精选</p>
      </td></tr>
      <tr><td style="padding:24px 32px;">
        ${bodyHtml}
      </td></tr>
      <tr><td style="background:#fafafa;padding:18px 32px;text-align:center;font-size:14px;color:#999;border-top:1px solid #eee;">
        数据来源 <a href="https://aihot.virxact.com" style="color:#777;">aihot.virxact.com</a>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}
