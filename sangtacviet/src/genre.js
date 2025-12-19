load("config.js");

function execute()
{
    // category codes đang được site dùng trên /search
    return Response.success([
        { title: "Huyền huyễn", input: "?find=&findinname=&host=&minc=0&sort=update&category=hh&type=&tag=&step=5", script: "gen.js" },
        { title: "Đô thị", input: "?find=&findinname=&host=&minc=0&sort=update&category=dt&type=&tag=&step=5", script: "gen.js" },
        { title: "Ngôn tình", input: "?find=&findinname=&host=&minc=0&sort=update&category=nt&type=&tag=&step=5", script: "gen.js" },
        { title: "Võng du", input: "?find=&findinname=&host=&minc=0&sort=update&category=vd&type=&tag=&step=5", script: "gen.js" },
        { title: "Khoa học viễn tưởng", input: "?find=&findinname=&host=&minc=0&sort=update&category=kh&type=&tag=&step=5", script: "gen.js" },
        { title: "Lịch sử", input: "?find=&findinname=&host=&minc=0&sort=update&category=lsa&type=&tag=&step=5", script: "gen.js" },
        { title: "Đồng nhân", input: "?find=&findinname=&host=&minc=0&sort=update&category=dn&type=&tag=&step=5", script: "gen.js" },
        { title: "Dị năng", input: "?find=&findinname=&host=&minc=0&sort=update&category=dna&type=&tag=&step=5", script: "gen.js" },
        { title: "Linh dị", input: "?find=&findinname=&host=&minc=0&sort=update&category=ld&type=&tag=&step=5", script: "gen.js" },
        { title: "Light Novel", input: "?find=&findinname=&host=&minc=0&sort=update&category=ln&type=&tag=&step=5", script: "gen.js" }
    ]);
}
