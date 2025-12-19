load("config.js");

function execute()
{
    // Dùng chung endpoint /io/searchtp/searchBooks (trả HTML fragment) để lấy danh sách.
    // input là query string (không kèm domain), gen.js sẽ tự append p=...
    return Response.success([
        {
            title: "Mới cập nhật",
            input: "?find=&findinname=&host=&minc=0&sort=update&category=&type=&tag=&step=5",
            script: "gen.js"
        },
        {
            title: "Truyện dài",
            input: "?find=&findinname=&host=&minc=2000&sort=update&category=&type=&tag=&step=5",
            script: "gen.js"
        },
        {
            title: "Sáng tác mới",
            input: "?find=&findinname=&host=&minc=0&sort=new&category=&type=sangtac&tag=&step=5",
            script: "gen.js"
        },
        {
            title: "Sáng tác hot (tuần)",
            input: "?find=&findinname=&host=&minc=0&sort=viewweek&category=&type=sangtac&tag=&step=5",
            script: "gen.js"
        },
        {
            title: "Đồng nhân hot (tuần)",
            input: "?find=&findinname=&host=&minc=50&sort=viewweek&category=dn&type=&tag=&step=5",
            script: "gen.js"
        }
    ]);
}
