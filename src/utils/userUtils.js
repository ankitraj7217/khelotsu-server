const getReturnUserData = (user, accessToken) => {
    const { _id, password: excludedPassword, __v, createdAt, updatedAt, ...userData } = user._doc;
    return { ...userData, accessToken };
}

export { getReturnUserData }