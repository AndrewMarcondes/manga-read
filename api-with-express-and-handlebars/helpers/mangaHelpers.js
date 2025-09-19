exports.trimMangaDescription = (description) => {
    const INDEX_OF_TRIPLE_DASH = description.indexOf("---")

    if (INDEX_OF_TRIPLE_DASH > 0)
        return description.slice(0, INDEX_OF_TRIPLE_DASH)
    else
        return description
}

