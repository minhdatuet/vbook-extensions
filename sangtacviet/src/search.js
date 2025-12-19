load("config.js");

function execute(key, page)
{
    if (!page) page = "1";

    let query = "?find=&findinname=" + encodeURIComponent(key)
        + "&host=&minc=0&sort=update&category=&type=&tag=&step=5";

    return fetchBooks(query, page);
}

function fetchBooks(query, page)
{
    query = normalizeQuery(query);
    query = setQueryPage(query, page);

    let apiUrl = BASE_URL + "/io/searchtp/searchBooks" + query;
    let response = fetch(apiUrl, {
        headers: {
            "user-agent": UserAgent.android()
        }
    });
    if (!response.ok)
    {
        return Response.error("Không lấy được kết quả tìm kiếm.");
    }

    let doc = Html.parse(response.text());
    let data = parseBookList(doc);

    let next = null;
    if (data.length > 0)
    {
        next = (parseInt(page) + 1) + "";
    }

    return Response.success(data, next);
}

function parseBookList(doc)
{
    let data = [];
    doc.select("a.booksearch").forEach(e => {
        let link = e.attr("href");
        let cover = e.select("img").first().attr("src");
        let name = e.select("b.searchbooktitle").text();
        let author = e.select("span.searchbookauthor").text();

        if (cover && cover.startsWith("//")) cover = "https:" + cover;
        if (cover && cover.startsWith("/")) cover = BASE_URL + cover;

        let tags = [];
        e.select("span.searchtag").forEach(t => {
            if (tags.length < 3) tags.push(t.text());
        });

        let description = author;
        if (tags.length > 0)
        {
            description = (description ? description + " • " : "") + tags.join(" • ");
        }

        data.push({
            name: name,
            link: link,
            cover: cover,
            description: description,
            host: BASE_URL
        });
    });

    return data;
}

function normalizeQuery(input)
{
    if (!input) return "?";

    // Nếu input là URL đầy đủ, chỉ lấy query string
    if (input.indexOf("http") === 0)
    {
        let m = input.match(/\?(.+)$/);
        input = m ? "?" + m[1] : "?";
    }

    if (input.indexOf("/?") === 0)
    {
        input = input.substring(1);
    }

    if (input.indexOf("?") !== 0)
    {
        input = "?" + input;
    }

    return input;
}

function setQueryPage(query, page)
{
    if (query.match(/([?&])p=\d+/))
    {
        return query.replace(/([?&])p=\d+/, "$1p=" + page);
    }

    if (query.slice(-1) === "?" || query.slice(-1) === "&")
    {
        return query + "p=" + page;
    }

    return query + "&p=" + page;
}
