load("config.js");

function execute(url)
{
    url = normalizeNovelUrl(url);

    let response = fetch(url);
    if (!response.ok)
    {
        return Response.error("Không tải được trang truyện.");
    }

    let html = response.text();

    let name = getMetaProperty(html, "og:novel:book_name");
    if (!name) name = getMetaProperty(html, "og:title");

    let cover = getMetaProperty(html, "og:image");
    let author = getMetaProperty(html, "og:novel:author");
    let description = getMetaProperty(html, "og:description");

    let category = getMetaProperty(html, "og:novel:category");
    let status = getMetaProperty(html, "og:novel:status");
    let updateTime = getMetaProperty(html, "og:novel:update_time");

    let detail = "";
    if (author) detail += "Tác giả: " + author + "<br>";
    if (category) detail += "Thể loại: " + category + "<br>";
    if (status) detail += "Trạng thái: " + status + "<br>";
    if (updateTime) detail += "Cập nhật: " + updateTime + "<br>";

    let ongoing = false;
    if (status)
    {
        let s = status.toLowerCase();
        ongoing = s.indexOf("còn tiếp") >= 0 || s.indexOf("đang ra") >= 0 || s.indexOf("ongoing") >= 0;
    }

    return Response.success({
        name: name,
        cover: cover,
        host: BASE_URL,
        author: author,
        description: description,
        detail: detail,
        ongoing: ongoing
    });
}

function normalizeNovelUrl(url)
{
    // Nếu user paste URL chương thì cắt về URL truyện: /truyen/{host}/1/{bookId}/
    let m = url.match(/\/truyen\/([^/]+)\/(\d+)\/(\d+)\/(\d+)\/?$/);
    if (m)
    {
        return BASE_URL + "/truyen/" + m[1] + "/" + m[2] + "/" + m[3] + "/";
    }

    // Chuẩn hóa domain
    url = url.replace(/^(?:https?:\/\/)?(?:www\.)?[^/]+/i, BASE_URL);
    return url;
}

function getMetaProperty(html, propertyName)
{
    let re = new RegExp("property=\\\"" + escapeRegExp(propertyName) + "\\\"\\s+content=\\\"([^\\\"]*)\\\"", "i");
    let m = re.exec(html);
    if (m && m[1]) return m[1];
    return "";
}

function escapeRegExp(s)
{
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
