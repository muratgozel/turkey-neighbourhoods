declare global {
    namespace NodeJS {
        interface ProcessEnv {
            npm_package_config_neighbourhoods_endpoint: string
            npm_package_config_distances_endpoint: string
        }
    }
}

export {}
