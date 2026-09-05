/**
 * DataProvider Factory
 * Provides a clean CRUD repository adapter adhering to the 'in' / 'local' convention.
 */
export const createDataProvider = ({
    inBaseUrl = "",
    inReadUrl = "",
    inCreateUrl = "",
    inUpdateUrl = "",
    inDeleteUrl = "",
    inHeaders = {},
    inFetchOptions = {},
    inCustom = {}
} = {}) => {
    const localBaseUrl = inBaseUrl;
    const localReadUrl = inReadUrl || localBaseUrl;
    const localCreateUrl = inCreateUrl || localBaseUrl;
    const localUpdateUrl = inUpdateUrl || localBaseUrl;
    const localDeleteUrl = inDeleteUrl || localBaseUrl;
    const localHeaders = {
        "Content-Type": "application/json",
        ...inHeaders
    };
    const localFetchOptions = inFetchOptions;
    const localCustom = inCustom;

    return {
        read: async ({ inQuery = {}, inUrl } = {}) => {
            const localQuery = inQuery;
            if (typeof localCustom.read === "function") {
                return await localCustom.read({ inQuery: localQuery });
            }
            const localTargetUrl = inUrl || localReadUrl;
            if (!localTargetUrl) return [];

            let url = localTargetUrl;
            if (localQuery && typeof localQuery === "object" && Object.keys(localQuery).length > 0) {
                const params = new URLSearchParams(localQuery).toString();
                if (params) {
                    url += (url.includes("?") ? "&" : "?") + params;
                }
            }

            const response = await fetch(url, {
                method: "GET",
                headers: localHeaders,
                ...localFetchOptions
            });

            if (!response.ok) {
                throw new Error(`DataProvider read failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        },

        create: async ({ inItem = {}, inUrl } = {}) => {
            const localItem = inItem;
            if (typeof localCustom.create === "function") {
                return await localCustom.create({ inItem: localItem });
            }

            const localTargetUrl = inUrl || localCreateUrl;
            const response = await fetch(localTargetUrl, {
                method: "POST",
                headers: localHeaders,
                body: JSON.stringify(localItem),
                ...localFetchOptions
            });

            if (!response.ok) {
                throw new Error(`DataProvider create failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        },

        update: async ({ inId, inItem = {}, inUrl } = {}) => {
            const localId = inId;
            const localItem = inItem;
            if (typeof localCustom.update === "function") {
                return await localCustom.update({ inId: localId, inItem: localItem });
            }

            let targetUrl = inUrl || localUpdateUrl;
            if (localId != null) {
                if (targetUrl.includes(":id")) {
                    targetUrl = targetUrl.replace(":id", encodeURIComponent(localId));
                } else {
                    targetUrl = `${targetUrl.replace(/\/$/, "")}/${encodeURIComponent(localId)}`;
                }
            }

            const response = await fetch(targetUrl, {
                method: "PUT",
                headers: localHeaders,
                body: JSON.stringify(localItem),
                ...localFetchOptions
            });

            if (!response.ok) {
                throw new Error(`DataProvider update failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        },

        delete: async ({ inId, inUrl } = {}) => {
            const localId = inId;
            if (typeof localCustom.delete === "function") {
                return await localCustom.delete({ inId: localId });
            }

            let targetUrl = inUrl || localDeleteUrl;
            if (localId != null) {
                if (targetUrl.includes(":id")) {
                    targetUrl = targetUrl.replace(":id", encodeURIComponent(localId));
                } else {
                    targetUrl = `${targetUrl.replace(/\/$/, "")}/${encodeURIComponent(localId)}`;
                }
            }

            const response = await fetch(targetUrl, {
                method: "DELETE",
                headers: localHeaders,
                ...localFetchOptions
            });

            if (!response.ok) {
                throw new Error(`DataProvider delete failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        }
    };
};

export default createDataProvider;
