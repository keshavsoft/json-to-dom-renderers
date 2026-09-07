import config from "./config.json" with { type: "json" };

const getTemplateConfig = () => {
    return structuredClone(config);
};

export { config, getTemplateConfig };
export default config;
