export const count = ({ inData = [] } = {}) => {
    const localData = inData;
    return Array.isArray(localData) ? localData.length : 0;
};

export default count;
