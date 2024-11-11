export const formatDate = (date: Date) => {
    let day = `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
    return day
}