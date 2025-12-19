load("config.js");

function execute(url)
{
    let p = parseNovelUrl(url);
    if (!p)
    {
        return Response.error("URL truyện không hợp lệ.");
    }

    let apiUrl = BASE_URL + "/index.php"
        + "?ngmar=chapterlist"
        + "&h=" + encodeURIComponent(p.hostKey)
        + "&bookid=" + encodeURIComponent(p.bookId)
        + "&sajax=getchapterlist";

    let response = fetch(apiUrl, {
        headers: {
            "Referer": p.novelUrl
        }
    });

    if (!response.ok)
    {
        return Response.error("Không lấy được mục lục.");
    }

    let json = response.json();
    if (!json || json.code !== 1 || !json.data)
    {
        return Response.error("Mục lục trả về không hợp lệ.");
    }

    // json.data: "1-/-<chapterId>-/- <title>-//-..."
    let entries = (json.data + "").split("-//-");
    let chapters = [];

    entries.forEach(function (entry)
    {
        entry = (entry + "").trim();
        if (!entry) return;

        let parts = entry.split("-/-");
        if (parts.length < 3) return;

        let chapterId = (parts[1] + "").trim();
        let chapterTitle = (parts[2] + "").trim();

        if (!/^\d+$/.test(chapterId)) return;

        chapters.push({
            name: chapterTitle,
            url: BASE_URL + "/truyen/" + p.hostKey + "/1/" + p.bookId + "/" + chapterId + "/",
            host: BASE_URL
        });
    });

    return Response.success(chapters);
}

function parseNovelUrl(url)
{
    url = url.replace(/^(?:https?:\/\/)?(?:www\.)?[^/]+/i, BASE_URL);

    // URL truyện: /truyen/{host}/1/{bookId}/
    let m1 = url.match(/\/truyen\/([^/]+)\/(\d+)\/(\d+)\/?$/);
    if (m1)
    {
        return {
            hostKey: m1[1],
            bookId: m1[3],
            novelUrl: BASE_URL + "/truyen/" + m1[1] + "/" + m1[2] + "/" + m1[3] + "/"
        };
    }

    // URL chương: /truyen/{host}/1/{bookId}/{chapterId}/ => cắt về truyện
    let m2 = url.match(/\/truyen\/([^/]+)\/(\d+)\/(\d+)\/(\d+)\/?$/);
    if (m2)
    {
        return {
            hostKey: m2[1],
            bookId: m2[3],
            novelUrl: BASE_URL + "/truyen/" + m2[1] + "/" + m2[2] + "/" + m2[3] + "/"
        };
    }

    return null;
}
