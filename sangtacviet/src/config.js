let BASE_URL = "https://sangtacviet.com";
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
}
catch (e) {
}

// Nếu không được override, thử tự detect domain đang hoạt động
// Thứ tự ưu tiên: .com → .vip → .app
try {
    if (typeof __DETECTED_BASE_URL__ !== "undefined") {
        // Dùng lại kết quả đã detect từ lần trước (cache trong cùng session)
        BASE_URL = __DETECTED_BASE_URL__;
    }
    else {
        let candidates = [
            "https://sangtacviet.com",
            "https://sangtacviet.vip",
            "https://sangtacviet.app"
        ];
        for (let i = 0; i < candidates.length; i++) {
            try {
                let r = fetch(candidates[i], {
                    method: "HEAD",
                    headers: { "user-agent": UserAgent.android() }
                });
                if (r && r.status < 500) {
                    BASE_URL = candidates[i];
                    break;
                }
            }
            catch (e2) { /* domain không truy cập được, thử cái tiếp theo */ }
        }
        __DETECTED_BASE_URL__ = BASE_URL;
    }
}
catch (e) {
}
