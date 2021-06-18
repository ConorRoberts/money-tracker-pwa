export default function numberFilter(str) {
    return str.split("").filter(e => (!isNaN(e) || e === ".") && e !== " ").join("");
}