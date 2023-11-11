function pack(entityArray) {
    return Object.keys(entityArray).map(key => {
        return {id: key, ...entityArray[key]};
    })
}
export { pack };