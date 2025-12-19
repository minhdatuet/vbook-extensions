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
            "Content-Type": "application/x-www-form-urlencoded",
            "user-agent": UserAgent.android()
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

    // SangTacViet thường trả HTML có nhiều thẻ inline (<i>, <span>...) đặt sát nhau,
    // khi app render/strip có thể bị dính chữ. Chuẩn hóa về text rồi đổi lại thành <br>.
    let content = json.data + "";
    let html = normalizeChapterHtmlToReadableHtml(content);

    return Response.success(html);
}

function normalizeChapterHtmlToReadableHtml(contentHtml)
{
    if (!contentHtml) return "";

    // Loại bỏ thông báo hệ thống
    contentHtml = contentHtml.replace(/@Bạn đang đọc bản lưu trong hệ thống\s*/g, "");

    // Parse bằng jsoup
    let doc = Html.parse(contentHtml);

    // Bỏ script/style nếu có
    doc.select("script,style").remove();

    // Giữ xuống dòng: biến <br> thành \n trước khi text()
    doc.select("br").after("\n");
    doc.select("p").after("\n\n");

    // Bỏ thẻ <i> nhưng giữ text (tránh dính chữ do inline tokens)
    doc.select("i").forEach(e => {
        e.replaceWith(e.text());
    });

    // Bỏ các span không cần thiết (nếu có) nhưng giữ text
    doc.select("span").forEach(e => {
        e.replaceWith(e.text());
    });

    // Lấy text đã được jsoup normalize whitespace (thường sẽ tự chèn space hợp lý)
    let text = doc.text();

    // Cleanup whitespace
    text = text.replace(/\r/g, "");
    text = text.replace(/[ \t]{2,}/g, " ");
    text = text.replace(/ *\n */g, "\n");
    text = text.trim();

    // Đổi xuống dòng thành <br> để app hiển thị đúng
    text = text.replace(/\n{3,}/g, "\n\n");
    return text.replace(/\n/g, "<br>");
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
