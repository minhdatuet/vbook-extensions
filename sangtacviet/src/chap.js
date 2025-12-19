load("config.js");

function execute(url)
{
    let p = parseChapterUrl(url);
    if (!p)
    {
        return Response.error("URL chương không hợp lệ.");
    }

    let apiUrl = BASE_URL + "/index.php"
        + "?bookid=" + encodeURIComponent(p.bookId)
        + "&h=" + encodeURIComponent(p.hostKey)
        + "&c=" + encodeURIComponent(p.chapterId)
        + "&ngmar=readc&sajax=readchapter&sty=1&exts=";

    let response = fetch(apiUrl, {
        method: "POST",
        headers: {
            "Origin": BASE_URL,
            "Referer": p.chapterUrl,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: ""
    });

    if (!response.ok)
    {
        return Response.error("Không tải được nội dung chương.");
    }

    let json = response.json();
    if (!json || (json.code + "") !== "0")
    {
        if (json && (json.code + "") === "7")
        {
            return Response.error("Bạn cần đăng nhập sangtacviet.app để đọc chương này.");
        }
        return Response.error("Lỗi tải chương (code=" + (json ? json.code : "unknown") + ").");
    }

    return Response.success(json.data);
}

function parseChapterUrl(url)
{
    url = url.replace(/^(?:https?:\/\/)?(?:www\.)?[^/]+/i, BASE_URL);

    let m = url.match(/\/truyen\/([^/]+)\/(\d+)\/(\d+)\/(\d+)\/?$/);
    if (!m) return null;

    return {
        hostKey: m[1],
        bookId: m[3],
        chapterId: m[4],
        chapterUrl: BASE_URL + "/truyen/" + m[1] + "/" + m[2] + "/" + m[3] + "/" + m[4] + "/"
    };
}
