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

    // 1) Chèn khoảng trắng giữa các thẻ inline đặt sát nhau (nguồn gây dính chữ)
    // Ví dụ hay gặp: </i><i ...>word</i><i ...>word2</i> => cần có khoảng trắng giữa các token.
    contentHtml = contentHtml
        .replace(/<\/i>\s*<i\b/gi, "</i> <i")
        .replace(/<\/span>\s*<span\b/gi, "</span> <span")
        .replace(/<\/b>\s*<b\b/gi, "</b> <b")
        .replace(/<\/em>\s*<em\b/gi, "</em> <em")
        .replace(/<\/strong>\s*<strong\b/gi, "</strong> <strong")
        .replace(/<\/a>\s*<a\b/gi, "</a> <a");

    // 2) Giữ xuống dòng bằng token trước khi parse/strip (vì doc.text() sẽ normalize whitespace)
    contentHtml = contentHtml
        .replace(/<br\s*\/?>/gi, " __BR__ ")
        .replace(/<\/p\s*>/gi, " __P__ ");

    // Runtime JS của vBook có giới hạn thao tác DOM, nên chỉ parse để decode entity + lấy text.
    let doc = Html.parse(contentHtml);
    doc.select("script,style").remove();

    let text = doc.text();

    // Khôi phục xuống dòng
    text = text.replace(/__P__/g, "\n\n");
    text = text.replace(/__BR__/g, "\n");

    // Cleanup whitespace
    text = text.replace(/\r/g, "");
    text = text.replace(/[ \t]{2,}/g, " ");
    text = text.replace(/ *\n */g, "\n");

    // Fix khoảng trắng trước dấu câu do bước chèn space
    text = text.replace(/\s+([,.;:!?])/g, "$1");

    text = text.trim();
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
