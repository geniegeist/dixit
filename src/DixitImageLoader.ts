const DixitImageLoader = {
    count: () => {
        return require.context('./assets/dixit', true).keys().length;
    },
    load: (key: string) => {
        const reqSvgs = require.context ( './assets/dixit', true, /\.(png|jpe?g|svg)$/);
        const allSvgFilepaths = reqSvgs.keys()
        return reqSvgs(allSvgFilepaths[parseInt(key)]).default;
    }
};

export default DixitImageLoader;