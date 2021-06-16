const capitalize = (str:string):string =>
    str
        ?.split(" ")
        ?.map((e) => e[0]?.toUpperCase() + e.slice(1))
        ?.join(" ");

export default capitalize;
