/**
 * 星瀚空间网站全局配置
 * ------------------------------------------------------------------
 * 部署说明：
 *   - API_BASE：后端 API 的根地址。
 *     · 本地开发保持默认 'http://localhost:5000' 即可。
 *     · 生产部署请改成你的实际 API 域名，例如：
 *         window.API_BASE = 'https://api.your-domain.com';
 *     · 若前后端同域部署，可设为空字符串 ''，所有请求会使用相对路径。
 *   - 修改此文件后无需改动任何 HTML / 页面脚本。
 */
window.API_BASE = window.API_BASE || 'http://localhost:5000';

// 动态注入 dns-prefetch，避免在 HTML 中硬编码本地地址
(function () {
    try {
        if (window.API_BASE) {
            var origin = window.API_BASE.replace(/\/$/, '');
            var link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = origin;
            document.head.appendChild(link);
        }
    } catch (e) { /* 忽略 */ }
})();
