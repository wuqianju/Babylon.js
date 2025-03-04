declare module BABYLON {
    /**
     * Configuration for glTF validation
     */
    export interface IGLTFValidationConfiguration {
        /**
         * The url of the glTF validator.
         */
        url: string;
    }
    /**
     * glTF validation
     */
    export class GLTFValidation {
        /**
         * The configuration. Defaults to `{ url: "https://preview.babylonjs.com/gltf_validator.js" }`.
         */
        static Configuration: IGLTFValidationConfiguration;
        private static _LoadScriptPromise;
        /**
         * Validate a glTF asset using the glTF-Validator.
         * @param data The JSON of a glTF or the array buffer of a binary glTF
         * @param rootUrl The root url for the glTF
         * @param fileName The file name for the glTF
         * @param getExternalResource The callback to get external resources for the glTF validator
         * @returns A promise that resolves with the glTF validation results once complete
         */
        static ValidateAsync(data: string | ArrayBuffer, rootUrl: string, fileName: string, getExternalResource: (uri: string) => Promise<ArrayBuffer>): Promise<BABYLON.GLTF2.IGLTFValidationResults>;
    }
}
declare module BABYLON {
    /**
     * Mode that determines the coordinate system to use.
     */
    export enum GLTFLoaderCoordinateSystemMode {
        /**
         * Automatically convert the glTF right-handed data to the appropriate system based on the current coordinate system mode of the scene.
         */
        AUTO = 0,
        /**
         * Sets the useRightHandedSystem flag on the scene.
         */
        FORCE_RIGHT_HANDED = 1
    }
    /**
     * Mode that determines what animations will start.
     */
    export enum GLTFLoaderAnimationStartMode {
        /**
         * No animation will start.
         */
        NONE = 0,
        /**
         * The first animation will start.
         */
        FIRST = 1,
        /**
         * All animations will start.
         */
        ALL = 2
    }
    /**
     * Interface that contains the data for the glTF asset.
     */
    export interface IGLTFLoaderData {
        /**
         * The object that represents the glTF JSON.
         */
        json: Object;
        /**
         * The BIN chunk of a binary glTF.
         */
        bin: Nullable<IDataBuffer>;
    }
    /**
     * Interface for extending the loader.
     */
    export interface IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines the order of this extension.
         * The loader sorts the extensions using these values when loading.
         */
        order?: number;
    }
    /**
     * Loader state.
     */
    export enum GLTFLoaderState {
        /**
         * The asset is loading.
         */
        LOADING = 0,
        /**
         * The asset is ready for rendering.
         */
        READY = 1,
        /**
         * The asset is completely loaded.
         */
        COMPLETE = 2
    }
    /** @hidden */
    export interface IGLTFLoader extends IDisposable {
        importMeshAsync: (meshesNames: any, scene: Scene, container: Nullable<AssetContainer>, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string) => Promise<ISceneLoaderAsyncResult>;
        loadAsync: (scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string) => Promise<void>;
    }
    /**
     * File loader for loading glTF files into a scene.
     */
    export class GLTFFileLoader implements IDisposable, ISceneLoaderPluginAsync, ISceneLoaderPluginFactory {
        /** @hidden */
        static _CreateGLTF1Loader: (parent: GLTFFileLoader) => IGLTFLoader;
        /** @hidden */
        static _CreateGLTF2Loader: (parent: GLTFFileLoader) => IGLTFLoader;
        /**
         * Raised when the asset has been parsed
         */
        onParsedObservable: Observable<IGLTFLoaderData>;
        private _onParsedObserver;
        /**
         * Raised when the asset has been parsed
         */
        set onParsed(callback: (loaderData: IGLTFLoaderData) => void);
        /**
         * Set this property to false to disable incremental loading which delays the loader from calling the success callback until after loading the meshes and shaders.
         * Textures always loads asynchronously. For example, the success callback can compute the bounding information of the loaded meshes when incremental loading is disabled.
         * Defaults to true.
         * @hidden
         */
        static IncrementalLoading: boolean;
        /**
         * Set this property to true in order to work with homogeneous coordinates, available with some converters and exporters.
         * Defaults to false. See https://en.wikipedia.org/wiki/Homogeneous_coordinates.
         * @hidden
         */
        static HomogeneousCoordinates: boolean;
        /**
         * The coordinate system mode. Defaults to AUTO.
         */
        coordinateSystemMode: GLTFLoaderCoordinateSystemMode;
        /**
        * The animation start mode. Defaults to FIRST.
        */
        animationStartMode: GLTFLoaderAnimationStartMode;
        /**
         * Defines if the loader should compile materials before raising the success callback. Defaults to false.
         */
        compileMaterials: boolean;
        /**
         * Defines if the loader should also compile materials with clip planes. Defaults to false.
         */
        useClipPlane: boolean;
        /**
         * Defines if the loader should compile shadow generators before raising the success callback. Defaults to false.
         */
        compileShadowGenerators: boolean;
        /**
         * Defines if the Alpha blended materials are only applied as coverage.
         * If false, (default) The luminance of each pixel will reduce its opacity to simulate the behaviour of most physical materials.
         * If true, no extra effects are applied to transparent pixels.
         */
        transparencyAsCoverage: boolean;
        /**
         * Defines if the loader should use range requests when load binary glTF files from HTTP.
         * Enabling will disable offline support and glTF validator.
         * Defaults to false.
         */
        useRangeRequests: boolean;
        /**
         * Defines if the loader should create instances when multiple glTF nodes point to the same glTF mesh. Defaults to true.
         */
        createInstances: boolean;
        /**
         * Defines if the loader should always compute the bounding boxes of meshes and not use the min/max values from the position accessor. Defaults to false.
         */
        alwaysComputeBoundingBox: boolean;
        /**
         * If true, load all materials defined in the file, even if not used by any mesh. Defaults to false.
         */
        loadAllMaterials: boolean;
        /**
         * If true, load the color (gamma encoded) textures into sRGB buffers (if supported by the GPU), which will yield more accurate results when sampling the texture. Defaults to true.
         */
        useSRGBBuffers: boolean;
        /**
        * Function called before loading a url referenced by the asset.
        */
        preprocessUrlAsync: (url: string) => Promise<string>;
        /**
         * Observable raised when the loader creates a mesh after parsing the glTF properties of the mesh.
         * Note that the observable is raised as soon as the mesh object is created, meaning some data may not have been setup yet for this mesh (vertex data, morph targets, material, ...)
         */
        readonly onMeshLoadedObservable: Observable<AbstractMesh>;
        private _onMeshLoadedObserver;
        /**
         * Callback raised when the loader creates a mesh after parsing the glTF properties of the mesh.
         * Note that the callback is called as soon as the mesh object is created, meaning some data may not have been setup yet for this mesh (vertex data, morph targets, material, ...)
         */
        set onMeshLoaded(callback: (mesh: AbstractMesh) => void);
        /**
         * Observable raised when the loader creates a texture after parsing the glTF properties of the texture.
         */
        readonly onTextureLoadedObservable: Observable<BaseTexture>;
        private _onTextureLoadedObserver;
        /**
         * Callback raised when the loader creates a texture after parsing the glTF properties of the texture.
         */
        set onTextureLoaded(callback: (texture: BaseTexture) => void);
        /**
         * Observable raised when the loader creates a material after parsing the glTF properties of the material.
         */
        readonly onMaterialLoadedObservable: Observable<Material>;
        private _onMaterialLoadedObserver;
        /**
         * Callback raised when the loader creates a material after parsing the glTF properties of the material.
         */
        set onMaterialLoaded(callback: (material: Material) => void);
        /**
         * Observable raised when the loader creates a camera after parsing the glTF properties of the camera.
         */
        readonly onCameraLoadedObservable: Observable<Camera>;
        private _onCameraLoadedObserver;
        /**
         * Callback raised when the loader creates a camera after parsing the glTF properties of the camera.
         */
        set onCameraLoaded(callback: (camera: Camera) => void);
        /**
         * Observable raised when the asset is completely loaded, immediately before the loader is disposed.
         * For assets with LODs, raised when all of the LODs are complete.
         * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
         */
        readonly onCompleteObservable: Observable<void>;
        private _onCompleteObserver;
        /**
         * Callback raised when the asset is completely loaded, immediately before the loader is disposed.
         * For assets with LODs, raised when all of the LODs are complete.
         * For assets without LODs, raised when the model is complete, immediately after the loader resolves the returned promise.
         */
        set onComplete(callback: () => void);
        /**
         * Observable raised when an error occurs.
         */
        readonly onErrorObservable: Observable<any>;
        private _onErrorObserver;
        /**
         * Callback raised when an error occurs.
         */
        set onError(callback: (reason: any) => void);
        /**
         * Observable raised after the loader is disposed.
         */
        readonly onDisposeObservable: Observable<void>;
        private _onDisposeObserver;
        /**
         * Callback raised after the loader is disposed.
         */
        set onDispose(callback: () => void);
        /**
         * Observable raised after a loader extension is created.
         * Set additional options for a loader extension in this event.
         */
        readonly onExtensionLoadedObservable: Observable<IGLTFLoaderExtension>;
        private _onExtensionLoadedObserver;
        /**
         * Callback raised after a loader extension is created.
         */
        set onExtensionLoaded(callback: (extension: IGLTFLoaderExtension) => void);
        /**
         * Defines if the loader logging is enabled.
         */
        get loggingEnabled(): boolean;
        set loggingEnabled(value: boolean);
        /**
         * Defines if the loader should capture performance counters.
         */
        get capturePerformanceCounters(): boolean;
        set capturePerformanceCounters(value: boolean);
        /**
         * Defines if the loader should validate the asset.
         */
        validate: boolean;
        /**
         * Observable raised after validation when validate is set to true. The event data is the result of the validation.
         */
        readonly onValidatedObservable: Observable<BABYLON.GLTF2.IGLTFValidationResults>;
        private _onValidatedObserver;
        /**
         * Callback raised after a loader extension is created.
         */
        set onValidated(callback: (results: BABYLON.GLTF2.IGLTFValidationResults) => void);
        private _loader;
        private _state;
        private _progressCallback?;
        private _requests;
        private static magicBase64Encoded;
        /**
         * Name of the loader ("gltf")
         */
        name: string;
        /** @hidden */
        extensions: ISceneLoaderPluginExtensions;
        /**
         * Disposes the loader, releases resources during load, and cancels any outstanding requests.
         */
        dispose(): void;
        /** @hidden */
        loadFile(scene: Scene, fileOrUrl: File | string, onSuccess: (data: any, responseURL?: string) => void, onProgress?: (ev: ISceneLoaderProgressEvent) => void, useArrayBuffer?: boolean, onError?: (request?: WebRequest, exception?: LoadFileError) => void): IFileRequest;
        /** @hidden */
        importMeshAsync(meshesNames: any, scene: Scene, data: any, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<ISceneLoaderAsyncResult>;
        /** @hidden */
        loadAsync(scene: Scene, data: any, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
        /** @hidden */
        loadAssetContainerAsync(scene: Scene, data: any, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<AssetContainer>;
        /** @hidden */
        canDirectLoad(data: string): boolean;
        /** @hidden */
        directLoad(scene: Scene, data: string): Promise<any>;
        /**
         * The callback that allows custom handling of the root url based on the response url.
         * @param rootUrl the original root url
         * @param responseURL the response url if available
         * @returns the new root url
         */
        rewriteRootURL?(rootUrl: string, responseURL?: string): string;
        /** @hidden */
        createPlugin(): ISceneLoaderPlugin | ISceneLoaderPluginAsync;
        /**
         * The loader state or null if the loader is not active.
         */
        get loaderState(): Nullable<GLTFLoaderState>;
        /**
         * Observable raised when the loader state changes.
         */
        onLoaderStateChangedObservable: Observable<Nullable<GLTFLoaderState>>;
        /**
         * Returns a promise that resolves when the asset is completely loaded.
         * @returns a promise that resolves when the asset is completely loaded.
         */
        whenCompleteAsync(): Promise<void>;
        /** @hidden */
        _setState(state: GLTFLoaderState): void;
        /** @hidden */
        _loadFile(scene: Scene, fileOrUrl: File | string, onSuccess: (data: string | ArrayBuffer) => void, useArrayBuffer?: boolean, onError?: (request?: WebRequest) => void, onOpened?: (request: WebRequest) => void): IFileRequest;
        private _onProgress;
        private _validate;
        private _getLoader;
        private _parseJson;
        private _unpackBinaryAsync;
        private _unpackBinaryV1Async;
        private _unpackBinaryV2Async;
        private static _parseVersion;
        private static _compareVersion;
        private static readonly _logSpaces;
        private _logIndentLevel;
        private _loggingEnabled;
        /** @hidden */
        _log: (message: string) => void;
        /** @hidden */
        _logOpen(message: string): void;
        /** @hidden */
        _logClose(): void;
        private _logEnabled;
        private _logDisabled;
        private _capturePerformanceCounters;
        /** @hidden */
        _startPerformanceCounter: (counterName: string) => void;
        /** @hidden */
        _endPerformanceCounter: (counterName: string) => void;
        private _startPerformanceCounterEnabled;
        private _startPerformanceCounterDisabled;
        private _endPerformanceCounterEnabled;
        private _endPerformanceCounterDisabled;
    }
}
declare module BABYLON.GLTF1 {
    /**
    * Enums
    * @hidden
    */
    export enum EComponentType {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        FLOAT = 5126
    }
    /** @hidden */
    export enum EShaderType {
        FRAGMENT = 35632,
        VERTEX = 35633
    }
    /** @hidden */
    export enum EParameterType {
        BYTE = 5120,
        UNSIGNED_BYTE = 5121,
        SHORT = 5122,
        UNSIGNED_SHORT = 5123,
        INT = 5124,
        UNSIGNED_INT = 5125,
        FLOAT = 5126,
        FLOAT_VEC2 = 35664,
        FLOAT_VEC3 = 35665,
        FLOAT_VEC4 = 35666,
        INT_VEC2 = 35667,
        INT_VEC3 = 35668,
        INT_VEC4 = 35669,
        BOOL = 35670,
        BOOL_VEC2 = 35671,
        BOOL_VEC3 = 35672,
        BOOL_VEC4 = 35673,
        FLOAT_MAT2 = 35674,
        FLOAT_MAT3 = 35675,
        FLOAT_MAT4 = 35676,
        SAMPLER_2D = 35678
    }
    /** @hidden */
    export enum ETextureWrapMode {
        CLAMP_TO_EDGE = 33071,
        MIRRORED_REPEAT = 33648,
        REPEAT = 10497
    }
    /** @hidden */
    export enum ETextureFilterType {
        NEAREST = 9728,
        LINEAR = 9728,
        NEAREST_MIPMAP_NEAREST = 9984,
        LINEAR_MIPMAP_NEAREST = 9985,
        NEAREST_MIPMAP_LINEAR = 9986,
        LINEAR_MIPMAP_LINEAR = 9987
    }
    /** @hidden */
    export enum ETextureFormat {
        ALPHA = 6406,
        RGB = 6407,
        RGBA = 6408,
        LUMINANCE = 6409,
        LUMINANCE_ALPHA = 6410
    }
    /** @hidden */
    export enum ECullingType {
        FRONT = 1028,
        BACK = 1029,
        FRONT_AND_BACK = 1032
    }
    /** @hidden */
    export enum EBlendingFunction {
        ZERO = 0,
        ONE = 1,
        SRC_COLOR = 768,
        ONE_MINUS_SRC_COLOR = 769,
        DST_COLOR = 774,
        ONE_MINUS_DST_COLOR = 775,
        SRC_ALPHA = 770,
        ONE_MINUS_SRC_ALPHA = 771,
        DST_ALPHA = 772,
        ONE_MINUS_DST_ALPHA = 773,
        CONSTANT_COLOR = 32769,
        ONE_MINUS_CONSTANT_COLOR = 32770,
        CONSTANT_ALPHA = 32771,
        ONE_MINUS_CONSTANT_ALPHA = 32772,
        SRC_ALPHA_SATURATE = 776
    }
    /** @hidden */
    export interface IGLTFProperty {
        extensions?: {
            [key: string]: any;
        };
        extras?: Object;
    }
    /** @hidden */
    export interface IGLTFChildRootProperty extends IGLTFProperty {
        name?: string;
    }
    /** @hidden */
    export interface IGLTFAccessor extends IGLTFChildRootProperty {
        bufferView: string;
        byteOffset: number;
        byteStride: number;
        count: number;
        type: string;
        componentType: EComponentType;
        max?: number[];
        min?: number[];
        name?: string;
    }
    /** @hidden */
    export interface IGLTFBufferView extends IGLTFChildRootProperty {
        buffer: string;
        byteOffset: number;
        byteLength: number;
        byteStride: number;
        target?: number;
    }
    /** @hidden */
    export interface IGLTFBuffer extends IGLTFChildRootProperty {
        uri: string;
        byteLength?: number;
        type?: string;
    }
    /** @hidden */
    export interface IGLTFShader extends IGLTFChildRootProperty {
        uri: string;
        type: EShaderType;
    }
    /** @hidden */
    export interface IGLTFProgram extends IGLTFChildRootProperty {
        attributes: string[];
        fragmentShader: string;
        vertexShader: string;
    }
    /** @hidden */
    export interface IGLTFTechniqueParameter {
        type: number;
        count?: number;
        semantic?: string;
        node?: string;
        value?: number | boolean | string | Array<any>;
        source?: string;
        babylonValue?: any;
    }
    /** @hidden */
    export interface IGLTFTechniqueCommonProfile {
        lightingModel: string;
        texcoordBindings: Object;
        parameters?: Array<any>;
    }
    /** @hidden */
    export interface IGLTFTechniqueStatesFunctions {
        blendColor?: number[];
        blendEquationSeparate?: number[];
        blendFuncSeparate?: number[];
        colorMask: boolean[];
        cullFace: number[];
    }
    /** @hidden */
    export interface IGLTFTechniqueStates {
        enable: number[];
        functions: IGLTFTechniqueStatesFunctions;
    }
    /** @hidden */
    export interface IGLTFTechnique extends IGLTFChildRootProperty {
        parameters: {
            [key: string]: IGLTFTechniqueParameter;
        };
        program: string;
        attributes: {
            [key: string]: string;
        };
        uniforms: {
            [key: string]: string;
        };
        states: IGLTFTechniqueStates;
    }
    /** @hidden */
    export interface IGLTFMaterial extends IGLTFChildRootProperty {
        technique?: string;
        values: string[];
    }
    /** @hidden */
    export interface IGLTFMeshPrimitive extends IGLTFProperty {
        attributes: {
            [key: string]: string;
        };
        indices: string;
        material: string;
        mode?: number;
    }
    /** @hidden */
    export interface IGLTFMesh extends IGLTFChildRootProperty {
        primitives: IGLTFMeshPrimitive[];
    }
    /** @hidden */
    export interface IGLTFImage extends IGLTFChildRootProperty {
        uri: string;
    }
    /** @hidden */
    export interface IGLTFSampler extends IGLTFChildRootProperty {
        magFilter?: number;
        minFilter?: number;
        wrapS?: number;
        wrapT?: number;
    }
    /** @hidden */
    export interface IGLTFTexture extends IGLTFChildRootProperty {
        sampler: string;
        source: string;
        format?: ETextureFormat;
        internalFormat?: ETextureFormat;
        target?: number;
        type?: number;
        babylonTexture?: Texture;
    }
    /** @hidden */
    export interface IGLTFAmbienLight {
        color?: number[];
    }
    /** @hidden */
    export interface IGLTFDirectionalLight {
        color?: number[];
    }
    /** @hidden */
    export interface IGLTFPointLight {
        color?: number[];
        constantAttenuation?: number;
        linearAttenuation?: number;
        quadraticAttenuation?: number;
    }
    /** @hidden */
    export interface IGLTFSpotLight {
        color?: number[];
        constantAttenuation?: number;
        fallOfAngle?: number;
        fallOffExponent?: number;
        linearAttenuation?: number;
        quadraticAttenuation?: number;
    }
    /** @hidden */
    export interface IGLTFLight extends IGLTFChildRootProperty {
        type: string;
    }
    /** @hidden */
    export interface IGLTFCameraOrthographic {
        xmag: number;
        ymag: number;
        zfar: number;
        znear: number;
    }
    /** @hidden */
    export interface IGLTFCameraPerspective {
        aspectRatio: number;
        yfov: number;
        zfar: number;
        znear: number;
    }
    /** @hidden */
    export interface IGLTFCamera extends IGLTFChildRootProperty {
        type: string;
    }
    /** @hidden */
    export interface IGLTFAnimationChannelTarget {
        id: string;
        path: string;
    }
    /** @hidden */
    export interface IGLTFAnimationChannel {
        sampler: string;
        target: IGLTFAnimationChannelTarget;
    }
    /** @hidden */
    export interface IGLTFAnimationSampler {
        input: string;
        output: string;
        interpolation?: string;
    }
    /** @hidden */
    export interface IGLTFAnimation extends IGLTFChildRootProperty {
        channels?: IGLTFAnimationChannel[];
        parameters?: {
            [key: string]: string;
        };
        samplers?: {
            [key: string]: IGLTFAnimationSampler;
        };
    }
    /** @hidden */
    export interface IGLTFNodeInstanceSkin {
        skeletons: string[];
        skin: string;
        meshes: string[];
    }
    /** @hidden */
    export interface IGLTFSkins extends IGLTFChildRootProperty {
        bindShapeMatrix: number[];
        inverseBindMatrices: string;
        jointNames: string[];
        babylonSkeleton?: Skeleton;
    }
    /** @hidden */
    export interface IGLTFNode extends IGLTFChildRootProperty {
        camera?: string;
        children: string[];
        skin?: string;
        jointName?: string;
        light?: string;
        matrix: number[];
        mesh?: string;
        meshes?: string[];
        rotation?: number[];
        scale?: number[];
        translation?: number[];
        babylonNode?: Node;
    }
    /** @hidden */
    export interface IGLTFScene extends IGLTFChildRootProperty {
        nodes: string[];
    }
    /** @hidden */
    export interface IGLTFRuntime {
        extensions: {
            [key: string]: any;
        };
        accessors: {
            [key: string]: IGLTFAccessor;
        };
        buffers: {
            [key: string]: IGLTFBuffer;
        };
        bufferViews: {
            [key: string]: IGLTFBufferView;
        };
        meshes: {
            [key: string]: IGLTFMesh;
        };
        lights: {
            [key: string]: IGLTFLight;
        };
        cameras: {
            [key: string]: IGLTFCamera;
        };
        nodes: {
            [key: string]: IGLTFNode;
        };
        images: {
            [key: string]: IGLTFImage;
        };
        textures: {
            [key: string]: IGLTFTexture;
        };
        shaders: {
            [key: string]: IGLTFShader;
        };
        programs: {
            [key: string]: IGLTFProgram;
        };
        samplers: {
            [key: string]: IGLTFSampler;
        };
        techniques: {
            [key: string]: IGLTFTechnique;
        };
        materials: {
            [key: string]: IGLTFMaterial;
        };
        animations: {
            [key: string]: IGLTFAnimation;
        };
        skins: {
            [key: string]: IGLTFSkins;
        };
        currentScene?: Object;
        scenes: {
            [key: string]: IGLTFScene;
        };
        extensionsUsed: string[];
        extensionsRequired?: string[];
        buffersCount: number;
        shaderscount: number;
        scene: Scene;
        rootUrl: string;
        loadedBufferCount: number;
        loadedBufferViews: {
            [name: string]: ArrayBufferView;
        };
        loadedShaderCount: number;
        importOnlyMeshes: boolean;
        importMeshesNames?: string[];
        dummyNodes: Node[];
        assetContainer: Nullable<AssetContainer>;
    }
    /** @hidden */
    export interface INodeToRoot {
        bone: Bone;
        node: IGLTFNode;
        id: string;
    }
    /** @hidden */
    export interface IJointNode {
        node: IGLTFNode;
        id: string;
    }
}
declare module BABYLON.GLTF1 {
    /**
    * Utils functions for GLTF
    * @hidden
    */
    export class GLTFUtils {
        /**
         * Sets the given "parameter" matrix
         * @param scene: the Scene object
         * @param source: the source node where to pick the matrix
         * @param parameter: the GLTF technique parameter
         * @param uniformName: the name of the shader's uniform
         * @param shaderMaterial: the shader material
         */
        static SetMatrix(scene: Scene, source: Node, parameter: IGLTFTechniqueParameter, uniformName: string, shaderMaterial: ShaderMaterial | Effect): void;
        /**
         * Sets the given "parameter" matrix
         * @param shaderMaterial: the shader material
         * @param uniform: the name of the shader's uniform
         * @param value: the value of the uniform
         * @param type: the uniform's type (EParameterType FLOAT, VEC2, VEC3 or VEC4)
         */
        static SetUniform(shaderMaterial: ShaderMaterial | Effect, uniform: string, value: any, type: number): boolean;
        /**
        * Returns the wrap mode of the texture
        * @param mode: the mode value
        */
        static GetWrapMode(mode: number): number;
        /**
         * Returns the byte stride giving an accessor
         * @param accessor: the GLTF accessor objet
         */
        static GetByteStrideFromType(accessor: IGLTFAccessor): number;
        /**
         * Returns the texture filter mode giving a mode value
         * @param mode: the filter mode value
         */
        static GetTextureFilterMode(mode: number): ETextureFilterType;
        static GetBufferFromBufferView(gltfRuntime: IGLTFRuntime, bufferView: IGLTFBufferView, byteOffset: number, byteLength: number, componentType: EComponentType): ArrayBufferView;
        /**
         * Returns a buffer from its accessor
         * @param gltfRuntime: the GLTF runtime
         * @param accessor: the GLTF accessor
         */
        static GetBufferFromAccessor(gltfRuntime: IGLTFRuntime, accessor: IGLTFAccessor): any;
        /**
         * Decodes a buffer view into a string
         * @param view: the buffer view
         */
        static DecodeBufferToText(view: ArrayBufferView): string;
        /**
         * Returns the default material of gltf. Related to
         * https://github.com/KhronosGroup/glTF/tree/master/specification/1.0#appendix-a-default-material
         * @param scene: the Babylon.js scene
         */
        static GetDefaultMaterial(scene: Scene): ShaderMaterial;
        private static _DefaultMaterial;
    }
}
declare module BABYLON.GLTF1 {
    /**
    * Implementation of the base glTF spec
    * @hidden
    */
    export class GLTFLoaderBase {
        static CreateRuntime(parsedData: any, scene: Scene, rootUrl: string): IGLTFRuntime;
        static LoadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): void;
        static LoadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: Nullable<ArrayBufferView>) => void, onError: (message: string) => void): void;
        static CreateTextureAsync(gltfRuntime: IGLTFRuntime, id: string, buffer: Nullable<ArrayBufferView>, onSuccess: (texture: Texture) => void, onError: (message: string) => void): void;
        static LoadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string | ArrayBuffer) => void, onError?: (message: string) => void): void;
        static LoadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): void;
    }
    /**
    * glTF V1 Loader
    * @hidden
    */
    export class GLTFLoader implements IGLTFLoader {
        static Extensions: {
            [name: string]: GLTFLoaderExtension;
        };
        static RegisterExtension(extension: GLTFLoaderExtension): void;
        dispose(): void;
        private _importMeshAsync;
        /**
        * Imports one or more meshes from a loaded gltf file and adds them to the scene
        * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
        * @param scene the scene the meshes should be added to
        * @param assetContainer defines the asset container to use (can be null)
        * @param data gltf data containing information of the meshes in a loaded file
        * @param rootUrl root url to load from
        * @param onProgress event that fires when loading progress has occured
        * @returns a promise containg the loaded meshes, particles, skeletons and animations
        */
        importMeshAsync(meshesNames: any, scene: Scene, assetContainer: Nullable<AssetContainer>, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void): Promise<ISceneLoaderAsyncResult>;
        private _loadAsync;
        /**
        * Imports all objects from a loaded gltf file and adds them to the scene
        * @param scene the scene the objects should be added to
        * @param data gltf data containing information of the meshes in a loaded file
        * @param rootUrl root url to load from
        * @param onProgress event that fires when loading progress has occured
        * @returns a promise which completes when objects have been loaded to the scene
        */
        loadAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void): Promise<void>;
        private _loadShadersAsync;
        private _loadBuffersAsync;
        private _createNodes;
    }
    /** @hidden */
    export abstract class GLTFLoaderExtension {
        private _name;
        constructor(name: string);
        get name(): string;
        /**
        * Defines an override for loading the runtime
        * Return true to stop further extensions from loading the runtime
        */
        loadRuntimeAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess?: (gltfRuntime: IGLTFRuntime) => void, onError?: (message: string) => void): boolean;
        /**
         * Defines an onverride for creating gltf runtime
         * Return true to stop further extensions from creating the runtime
         */
        loadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError?: (message: string) => void): boolean;
        /**
        * Defines an override for loading buffers
        * Return true to stop further extensions from loading this buffer
        */
        loadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): boolean;
        /**
        * Defines an override for loading texture buffers
        * Return true to stop further extensions from loading this texture data
        */
        loadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
        /**
        * Defines an override for creating textures
        * Return true to stop further extensions from loading this texture
        */
        createTextureAsync(gltfRuntime: IGLTFRuntime, id: string, buffer: ArrayBufferView, onSuccess: (texture: Texture) => void, onError: (message: string) => void): boolean;
        /**
        * Defines an override for loading shader strings
        * Return true to stop further extensions from loading this shader data
        */
        loadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string) => void, onError: (message: string) => void): boolean;
        /**
        * Defines an override for loading materials
        * Return true to stop further extensions from loading this material
        */
        loadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): boolean;
        static LoadRuntimeAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess?: (gltfRuntime: IGLTFRuntime) => void, onError?: (message: string) => void): void;
        static LoadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError?: (message: string) => void): void;
        static LoadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (bufferView: ArrayBufferView) => void, onError: (message: string) => void, onProgress?: () => void): void;
        static LoadTextureAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (texture: Texture) => void, onError: (message: string) => void): void;
        static LoadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderData: string | ArrayBuffer) => void, onError: (message: string) => void): void;
        static LoadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): void;
        private static LoadTextureBufferAsync;
        private static CreateTextureAsync;
        private static ApplyExtensions;
    }
}
declare module BABYLON.GLTF1 {
    /** @hidden */
    export class GLTFBinaryExtension extends GLTFLoaderExtension {
        private _bin;
        constructor();
        loadRuntimeAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onSuccess: (gltfRuntime: IGLTFRuntime) => void, onError: (message: string) => void): boolean;
        loadBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
        loadTextureBufferAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (buffer: ArrayBufferView) => void, onError: (message: string) => void): boolean;
        loadShaderStringAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (shaderString: string) => void, onError: (message: string) => void): boolean;
    }
}
declare module BABYLON.GLTF1 {
    /** @hidden */
    export class GLTFMaterialsCommonExtension extends GLTFLoaderExtension {
        constructor();
        loadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime, onSuccess: () => void, onError: (message: string) => void): boolean;
        loadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: Material) => void, onError: (message: string) => void): boolean;
        private _loadTexture;
    }
}
declare module BABYLON.GLTF2.Loader {
    /**
     * Loader interface with an index field.
     */
    export interface IArrayItem {
        /**
         * The index of this item in the array.
         */
        index: number;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IAccessor extends BABYLON.GLTF2.IAccessor, IArrayItem {
        /** @hidden */
        _data?: Promise<ArrayBufferView>;
        /** @hidden */
        _babylonVertexBuffer?: Promise<VertexBuffer>;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IAnimationChannel extends BABYLON.GLTF2.IAnimationChannel, IArrayItem {
    }
    /** @hidden */
    export interface _IAnimationSamplerData {
        input: Float32Array;
        interpolation: BABYLON.GLTF2.AnimationSamplerInterpolation;
        output: Float32Array;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IAnimationSampler extends BABYLON.GLTF2.IAnimationSampler, IArrayItem {
        /** @hidden */
        _data?: Promise<_IAnimationSamplerData>;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IAnimation extends BABYLON.GLTF2.IAnimation, IArrayItem {
        channels: IAnimationChannel[];
        samplers: IAnimationSampler[];
        /** @hidden */
        _babylonAnimationGroup?: AnimationGroup;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IBuffer extends BABYLON.GLTF2.IBuffer, IArrayItem {
        /** @hidden */
        _data?: Promise<ArrayBufferView>;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IBufferView extends BABYLON.GLTF2.IBufferView, IArrayItem {
        /** @hidden */
        _data?: Promise<ArrayBufferView>;
        /** @hidden */
        _babylonBuffer?: Promise<Buffer>;
    }
    /**
     * Loader interface with additional members.
     */
    export interface ICamera extends BABYLON.GLTF2.ICamera, IArrayItem {
    }
    /**
     * Loader interface with additional members.
     */
    export interface IImage extends BABYLON.GLTF2.IImage, IArrayItem {
        /** @hidden */
        _data?: Promise<ArrayBufferView>;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IMaterialNormalTextureInfo extends BABYLON.GLTF2.IMaterialNormalTextureInfo, ITextureInfo {
    }
    /**
     * Loader interface with additional members.
     */
    export interface IMaterialOcclusionTextureInfo extends BABYLON.GLTF2.IMaterialOcclusionTextureInfo, ITextureInfo {
    }
    /**
     * Loader interface with additional members.
     */
    export interface IMaterialPbrMetallicRoughness extends BABYLON.GLTF2.IMaterialPbrMetallicRoughness {
        baseColorTexture?: ITextureInfo;
        metallicRoughnessTexture?: ITextureInfo;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IMaterial extends BABYLON.GLTF2.IMaterial, IArrayItem {
        pbrMetallicRoughness?: IMaterialPbrMetallicRoughness;
        normalTexture?: IMaterialNormalTextureInfo;
        occlusionTexture?: IMaterialOcclusionTextureInfo;
        emissiveTexture?: ITextureInfo;
        /** @hidden */
        _data?: {
            [babylonDrawMode: number]: {
                babylonMaterial: Material;
                babylonMeshes: AbstractMesh[];
                promise: Promise<void>;
            };
        };
    }
    /**
     * Loader interface with additional members.
     */
    export interface IMesh extends BABYLON.GLTF2.IMesh, IArrayItem {
        primitives: IMeshPrimitive[];
    }
    /**
     * Loader interface with additional members.
     */
    export interface IMeshPrimitive extends BABYLON.GLTF2.IMeshPrimitive, IArrayItem {
        /** @hidden */
        _instanceData?: {
            babylonSourceMesh: Mesh;
            promise: Promise<any>;
        };
    }
    /**
     * Loader interface with additional members.
     */
    export interface INode extends BABYLON.GLTF2.INode, IArrayItem {
        /**
         * The parent glTF node.
         */
        parent?: INode;
        /** @hidden */
        _babylonTransformNode?: TransformNode;
        /** @hidden */
        _primitiveBabylonMeshes?: AbstractMesh[];
        /** @hidden */
        _babylonBones?: Bone[];
        /** @hidden */
        _numMorphTargets?: number;
    }
    /** @hidden */
    export interface _ISamplerData {
        noMipMaps: boolean;
        samplingMode: number;
        wrapU: number;
        wrapV: number;
    }
    /**
     * Loader interface with additional members.
     */
    export interface ISampler extends BABYLON.GLTF2.ISampler, IArrayItem {
        /** @hidden */
        _data?: _ISamplerData;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IScene extends BABYLON.GLTF2.IScene, IArrayItem {
    }
    /**
     * Loader interface with additional members.
     */
    export interface ISkin extends BABYLON.GLTF2.ISkin, IArrayItem {
        /** @hidden */
        _data?: {
            babylonSkeleton: Skeleton;
            promise: Promise<void>;
        };
    }
    /**
     * Loader interface with additional members.
     */
    export interface ITexture extends BABYLON.GLTF2.ITexture, IArrayItem {
        /** @hidden */
        _textureInfo: ITextureInfo;
    }
    /**
     * Loader interface with additional members.
     */
    export interface ITextureInfo extends BABYLON.GLTF2.ITextureInfo {
        /** false or undefined if the texture holds color data (true if data are roughness, normal, ...) */
        nonColorData?: boolean;
    }
    /**
     * Loader interface with additional members.
     */
    export interface IGLTF extends BABYLON.GLTF2.IGLTF {
        accessors?: IAccessor[];
        animations?: IAnimation[];
        buffers?: IBuffer[];
        bufferViews?: IBufferView[];
        cameras?: ICamera[];
        images?: IImage[];
        materials?: IMaterial[];
        meshes?: IMesh[];
        nodes?: INode[];
        samplers?: ISampler[];
        scenes?: IScene[];
        skins?: ISkin[];
        textures?: ITexture[];
    }
}
declare module BABYLON.GLTF2 {
    /**
     * Interface for a glTF loader extension.
     */
    export interface IGLTFLoaderExtension extends BABYLON.IGLTFLoaderExtension, IDisposable {
        /**
         * Called after the loader state changes to LOADING.
         */
        onLoading?(): void;
        /**
         * Called after the loader state changes to READY.
         */
        onReady?(): void;
        /**
         * Define this method to modify the default behavior when loading scenes.
         * @param context The context when loading the asset
         * @param scene The glTF scene property
         * @returns A promise that resolves when the load is complete or null if not handled
         */
        loadSceneAsync?(context: string, scene: IScene): Nullable<Promise<void>>;
        /**
         * Define this method to modify the default behavior when loading nodes.
         * @param context The context when loading the asset
         * @param node The glTF node property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded Babylon transform node when the load is complete or null if not handled
         */
        loadNodeAsync?(context: string, node: INode, assign: (babylonMesh: TransformNode) => void): Nullable<Promise<TransformNode>>;
        /**
         * Define this method to modify the default behavior when loading cameras.
         * @param context The context when loading the asset
         * @param camera The glTF camera property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded Babylon camera when the load is complete or null if not handled
         */
        loadCameraAsync?(context: string, camera: ICamera, assign: (babylonCamera: Camera) => void): Nullable<Promise<Camera>>;
        /**
         * @hidden
         * Define this method to modify the default behavior when loading vertex data for mesh primitives.
         * @param context The context when loading the asset
         * @param primitive The glTF mesh primitive property
         * @returns A promise that resolves with the loaded geometry when the load is complete or null if not handled
         */
        _loadVertexDataAsync?(context: string, primitive: IMeshPrimitive, babylonMesh: Mesh): Nullable<Promise<Geometry>>;
        /**
         * @hidden
         * Define this method to modify the default behavior when loading data for mesh primitives.
         * @param context The context when loading the asset
         * @param name The mesh name when loading the asset
         * @param node The glTF node when loading the asset
         * @param mesh The glTF mesh when loading the asset
         * @param primitive The glTF mesh primitive property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded mesh when the load is complete or null if not handled
         */
        _loadMeshPrimitiveAsync?(context: string, name: string, node: INode, mesh: IMesh, primitive: IMeshPrimitive, assign: (babylonMesh: AbstractMesh) => void): Nullable<Promise<AbstractMesh>>;
        /**
         * @hidden
         * Define this method to modify the default behavior when loading materials. Load material creates the material and then loads material properties.
         * @param context The context when loading the asset
         * @param material The glTF material property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded Babylon material when the load is complete or null if not handled
         */
        _loadMaterialAsync?(context: string, material: IMaterial, babylonMesh: Nullable<Mesh>, babylonDrawMode: number, assign: (babylonMaterial: Material) => void): Nullable<Promise<Material>>;
        /**
         * Define this method to modify the default behavior when creating materials.
         * @param context The context when loading the asset
         * @param material The glTF material property
         * @param babylonDrawMode The draw mode for the Babylon material
         * @returns The Babylon material or null if not handled
         */
        createMaterial?(context: string, material: IMaterial, babylonDrawMode: number): Nullable<Material>;
        /**
         * Define this method to modify the default behavior when loading material properties.
         * @param context The context when loading the asset
         * @param material The glTF material property
         * @param babylonMaterial The Babylon material
         * @returns A promise that resolves when the load is complete or null if not handled
         */
        loadMaterialPropertiesAsync?(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        /**
         * Define this method to modify the default behavior when loading texture infos.
         * @param context The context when loading the asset
         * @param textureInfo The glTF texture info property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded Babylon texture when the load is complete or null if not handled
         */
        loadTextureInfoAsync?(context: string, textureInfo: ITextureInfo, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>>;
        /**
         * @hidden
         * Define this method to modify the default behavior when loading textures.
         * @param context The context when loading the asset
         * @param texture The glTF texture property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded Babylon texture when the load is complete or null if not handled
         */
        _loadTextureAsync?(context: string, texture: ITexture, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>>;
        /**
         * Define this method to modify the default behavior when loading animations.
         * @param context The context when loading the asset
         * @param animation The glTF animation property
         * @returns A promise that resolves with the loaded Babylon animation group when the load is complete or null if not handled
         */
        loadAnimationAsync?(context: string, animation: IAnimation): Nullable<Promise<AnimationGroup>>;
        /**
         * @hidden
         * Define this method to modify the default behavior when loading skins.
         * @param context The context when loading the asset
         * @param node The glTF node property
         * @param skin The glTF skin property
         * @returns A promise that resolves when the load is complete or null if not handled
         */
        _loadSkinAsync?(context: string, node: INode, skin: ISkin): Nullable<Promise<void>>;
        /**
         * @hidden
         * Define this method to modify the default behavior when loading uris.
         * @param context The context when loading the asset
         * @param property The glTF property associated with the uri
         * @param uri The uri to load
         * @returns A promise that resolves with the loaded data when the load is complete or null if not handled
         */
        _loadUriAsync?(context: string, property: IProperty, uri: string): Nullable<Promise<ArrayBufferView>>;
        /**
         * Define this method to modify the default behavior when loading buffer views.
         * @param context The context when loading the asset
         * @param bufferView The glTF buffer view property
         * @returns A promise that resolves with the loaded data when the load is complete or null if not handled
         */
        loadBufferViewAsync?(context: string, bufferView: IBufferView): Nullable<Promise<ArrayBufferView>>;
        /**
         * Define this method to modify the default behavior when loading buffers.
         * @param context The context when loading the asset
         * @param buffer The glTF buffer property
         * @param byteOffset The byte offset to load
         * @param byteLength The byte length to load
         * @returns A promise that resolves with the loaded data when the load is complete or null if not handled
         */
        loadBufferAsync?(context: string, buffer: IBuffer, byteOffset: number, byteLength: number): Nullable<Promise<ArrayBufferView>>;
    }
}
declare module BABYLON.GLTF2 {
    /**
     * Helper class for working with arrays when loading the glTF asset
     */
    export class ArrayItem {
        /**
         * Gets an item from the given array.
         * @param context The context when loading the asset
         * @param array The array to get the item from
         * @param index The index to the array
         * @returns The array item
         */
        static Get<T>(context: string, array: ArrayLike<T> | undefined, index: number | undefined): T;
        /**
         * Assign an `index` field to each item of the given array.
         * @param array The array of items
         */
        static Assign(array?: BABYLON.GLTF2.Loader.IArrayItem[]): void;
    }
    /**
     * The glTF 2.0 loader
     */
    export class GLTFLoader implements IGLTFLoader {
        /** @hidden */
        _completePromises: Promise<any>[];
        /** @hidden */
        _assetContainer: Nullable<AssetContainer>;
        /** Storage */
        _babylonLights: Light[];
        /** @hidden */
        _disableInstancedMesh: number;
        private _disposed;
        private _parent;
        private _extensions;
        private _rootUrl;
        private _fileName;
        private _uniqueRootUrl;
        private _gltf;
        private _bin;
        private _babylonScene;
        private _rootBabylonMesh;
        private _defaultBabylonMaterialData;
        private static _RegisteredExtensions;
        /**
         * The default glTF sampler.
         */
        static readonly DefaultSampler: ISampler;
        /**
         * Registers a loader extension.
         * @param name The name of the loader extension.
         * @param factory The factory function that creates the loader extension.
         */
        static RegisterExtension(name: string, factory: (loader: GLTFLoader) => IGLTFLoaderExtension): void;
        /**
         * Unregisters a loader extension.
         * @param name The name of the loader extension.
         * @returns A boolean indicating whether the extension has been unregistered
         */
        static UnregisterExtension(name: string): boolean;
        /**
         * The object that represents the glTF JSON.
         */
        get gltf(): IGLTF;
        /**
         * The BIN chunk of a binary glTF.
         */
        get bin(): Nullable<IDataBuffer>;
        /**
         * The parent file loader.
         */
        get parent(): GLTFFileLoader;
        /**
         * The Babylon scene when loading the asset.
         */
        get babylonScene(): Scene;
        /**
         * The root Babylon mesh when loading the asset.
         */
        get rootBabylonMesh(): Mesh;
        /** @hidden */
        constructor(parent: GLTFFileLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        importMeshAsync(meshesNames: any, scene: Scene, container: Nullable<AssetContainer>, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<ISceneLoaderAsyncResult>;
        /** @hidden */
        loadAsync(scene: Scene, data: IGLTFLoaderData, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
        private _loadAsync;
        private _loadData;
        private _setupData;
        private _loadExtensions;
        private _checkExtensions;
        private _createRootNode;
        /**
         * Loads a glTF scene.
         * @param context The context when loading the asset
         * @param scene The glTF scene property
         * @returns A promise that resolves when the load is complete
         */
        loadSceneAsync(context: string, scene: IScene): Promise<void>;
        private _forEachPrimitive;
        private _getGeometries;
        private _getMeshes;
        private _getTransformNodes;
        private _getSkeletons;
        private _getAnimationGroups;
        private _startAnimations;
        /**
         * Loads a glTF node.
         * @param context The context when loading the asset
         * @param node The glTF node property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded Babylon mesh when the load is complete
         */
        loadNodeAsync(context: string, node: INode, assign?: (babylonTransformNode: TransformNode) => void): Promise<TransformNode>;
        private _loadMeshAsync;
        /**
         * @hidden Define this method to modify the default behavior when loading data for mesh primitives.
         * @param context The context when loading the asset
         * @param name The mesh name when loading the asset
         * @param node The glTF node when loading the asset
         * @param mesh The glTF mesh when loading the asset
         * @param primitive The glTF mesh primitive property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded mesh when the load is complete or null if not handled
         */
        _loadMeshPrimitiveAsync(context: string, name: string, node: INode, mesh: IMesh, primitive: IMeshPrimitive, assign: (babylonMesh: AbstractMesh) => void): Promise<AbstractMesh>;
        private _loadVertexDataAsync;
        private _createMorphTargets;
        private _loadMorphTargetsAsync;
        private _loadMorphTargetVertexDataAsync;
        private static _LoadTransform;
        private _loadSkinAsync;
        private _loadBones;
        private _loadBone;
        private _loadSkinInverseBindMatricesDataAsync;
        private _updateBoneMatrices;
        private _getNodeMatrix;
        /**
         * Loads a glTF camera.
         * @param context The context when loading the asset
         * @param camera The glTF camera property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded Babylon camera when the load is complete
         */
        loadCameraAsync(context: string, camera: ICamera, assign?: (babylonCamera: Camera) => void): Promise<Camera>;
        private _loadAnimationsAsync;
        /**
         * Loads a glTF animation.
         * @param context The context when loading the asset
         * @param animation The glTF animation property
         * @returns A promise that resolves with the loaded Babylon animation group when the load is complete
         */
        loadAnimationAsync(context: string, animation: IAnimation): Promise<AnimationGroup>;
        /**
         * @hidden Loads a glTF animation channel.
         * @param context The context when loading the asset
         * @param animationContext The context of the animation when loading the asset
         * @param animation The glTF animation property
         * @param channel The glTF animation channel property
         * @param babylonAnimationGroup The babylon animation group property
         * @param animationTargetOverride The babylon animation channel target override property. My be null.
         * @returns A void promise when the channel load is complete
         */
        _loadAnimationChannelAsync(context: string, animationContext: string, animation: IAnimation, channel: IAnimationChannel, babylonAnimationGroup: AnimationGroup, animationTargetOverride?: Nullable<IAnimatable>): Promise<void>;
        private _loadAnimationSamplerAsync;
        /**
         * Loads a glTF buffer.
         * @param context The context when loading the asset
         * @param buffer The glTF buffer property
         * @param byteOffset The byte offset to use
         * @param byteLength The byte length to use
         * @returns A promise that resolves with the loaded data when the load is complete
         */
        loadBufferAsync(context: string, buffer: IBuffer, byteOffset: number, byteLength: number): Promise<ArrayBufferView>;
        /**
         * Loads a glTF buffer view.
         * @param context The context when loading the asset
         * @param bufferView The glTF buffer view property
         * @returns A promise that resolves with the loaded data when the load is complete
         */
        loadBufferViewAsync(context: string, bufferView: IBufferView): Promise<ArrayBufferView>;
        private _loadAccessorAsync;
        /** @hidden */
        _loadFloatAccessorAsync(context: string, accessor: IAccessor): Promise<Float32Array>;
        private _loadIndicesAccessorAsync;
        private _loadVertexBufferViewAsync;
        private _loadVertexAccessorAsync;
        private _loadMaterialMetallicRoughnessPropertiesAsync;
        /** @hidden */
        _loadMaterialAsync(context: string, material: IMaterial, babylonMesh: Nullable<Mesh>, babylonDrawMode: number, assign?: (babylonMaterial: Material) => void): Promise<Material>;
        private _createDefaultMaterial;
        /**
         * Creates a Babylon material from a glTF material.
         * @param context The context when loading the asset
         * @param material The glTF material property
         * @param babylonDrawMode The draw mode for the Babylon material
         * @returns The Babylon material
         */
        createMaterial(context: string, material: IMaterial, babylonDrawMode: number): Material;
        /**
         * Loads properties from a glTF material into a Babylon material.
         * @param context The context when loading the asset
         * @param material The glTF material property
         * @param babylonMaterial The Babylon material
         * @returns A promise that resolves when the load is complete
         */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Promise<void>;
        /**
         * Loads the normal, occlusion, and emissive properties from a glTF material into a Babylon material.
         * @param context The context when loading the asset
         * @param material The glTF material property
         * @param babylonMaterial The Babylon material
         * @returns A promise that resolves when the load is complete
         */
        loadMaterialBasePropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Promise<void>;
        /**
         * Loads the alpha properties from a glTF material into a Babylon material.
         * Must be called after the setting the albedo texture of the Babylon material when the material has an albedo texture.
         * @param context The context when loading the asset
         * @param material The glTF material property
         * @param babylonMaterial The Babylon material
         */
        loadMaterialAlphaProperties(context: string, material: IMaterial, babylonMaterial: Material): void;
        /**
         * Loads a glTF texture info.
         * @param context The context when loading the asset
         * @param textureInfo The glTF texture info property
         * @param assign A function called synchronously after parsing the glTF properties
         * @returns A promise that resolves with the loaded Babylon texture when the load is complete
         */
        loadTextureInfoAsync(context: string, textureInfo: ITextureInfo, assign?: (babylonTexture: BaseTexture) => void): Promise<BaseTexture>;
        /** @hidden */
        _loadTextureAsync(context: string, texture: ITexture, assign?: (babylonTexture: BaseTexture) => void): Promise<BaseTexture>;
        /** @hidden */
        _createTextureAsync(context: string, sampler: ISampler, image: IImage, assign?: (babylonTexture: BaseTexture) => void, textureLoaderOptions?: any, useSRGBBuffer?: boolean): Promise<BaseTexture>;
        private _loadSampler;
        /**
         * Loads a glTF image.
         * @param context The context when loading the asset
         * @param image The glTF image property
         * @returns A promise that resolves with the loaded data when the load is complete
         */
        loadImageAsync(context: string, image: IImage): Promise<ArrayBufferView>;
        /**
         * Loads a glTF uri.
         * @param context The context when loading the asset
         * @param property The glTF property associated with the uri
         * @param uri The base64 or relative uri
         * @returns A promise that resolves with the loaded data when the load is complete
         */
        loadUriAsync(context: string, property: IProperty, uri: string): Promise<ArrayBufferView>;
        /**
         * Adds a JSON pointer to the metadata of the Babylon object at `<object>.metadata.gltf.pointers`.
         * @param babylonObject the Babylon object with metadata
         * @param pointer the JSON pointer
         */
        static AddPointerMetadata(babylonObject: {
            metadata: any;
        }, pointer: string): void;
        private static _GetTextureWrapMode;
        private static _GetTextureSamplingMode;
        private static _GetTypedArrayConstructor;
        private static _GetTypedArray;
        private static _GetNumComponents;
        private static _ValidateUri;
        /** @hidden */
        static _GetDrawMode(context: string, mode: number | undefined): number;
        private _compileMaterialsAsync;
        private _compileShadowGeneratorsAsync;
        private _forEachExtensions;
        private _applyExtensions;
        private _extensionsOnLoading;
        private _extensionsOnReady;
        private _extensionsLoadSceneAsync;
        private _extensionsLoadNodeAsync;
        private _extensionsLoadCameraAsync;
        private _extensionsLoadVertexDataAsync;
        private _extensionsLoadMeshPrimitiveAsync;
        private _extensionsLoadMaterialAsync;
        private _extensionsCreateMaterial;
        private _extensionsLoadMaterialPropertiesAsync;
        private _extensionsLoadTextureInfoAsync;
        private _extensionsLoadTextureAsync;
        private _extensionsLoadAnimationAsync;
        private _extensionsLoadSkinAsync;
        private _extensionsLoadUriAsync;
        private _extensionsLoadBufferViewAsync;
        private _extensionsLoadBufferAsync;
        /**
         * Helper method called by a loader extension to load an glTF extension.
         * @param context The context when loading the asset
         * @param property The glTF property to load the extension from
         * @param extensionName The name of the extension to load
         * @param actionAsync The action to run
         * @returns The promise returned by actionAsync or null if the extension does not exist
         */
        static LoadExtensionAsync<TExtension = any, TResult = void>(context: string, property: IProperty, extensionName: string, actionAsync: (extensionContext: string, extension: TExtension) => Nullable<Promise<TResult>>): Nullable<Promise<TResult>>;
        /**
         * Helper method called by a loader extension to load a glTF extra.
         * @param context The context when loading the asset
         * @param property The glTF property to load the extra from
         * @param extensionName The name of the extension to load
         * @param actionAsync The action to run
         * @returns The promise returned by actionAsync or null if the extra does not exist
         */
        static LoadExtraAsync<TExtra = any, TResult = void>(context: string, property: IProperty, extensionName: string, actionAsync: (extraContext: string, extra: TExtra) => Nullable<Promise<TResult>>): Nullable<Promise<TResult>>;
        /**
         * Checks for presence of an extension.
         * @param name The name of the extension to check
         * @returns A boolean indicating the presence of the given extension name in `extensionsUsed`
         */
        isExtensionUsed(name: string): boolean;
        /**
         * Increments the indentation level and logs a message.
         * @param message The message to log
         */
        logOpen(message: string): void;
        /**
         * Decrements the indentation level.
         */
        logClose(): void;
        /**
         * Logs a message
         * @param message The message to log
         */
        log(message: string): void;
        /**
         * Starts a performance counter.
         * @param counterName The name of the performance counter
         */
        startPerformanceCounter(counterName: string): void;
        /**
         * Ends a performance counter.
         * @param counterName The name of the performance counter
         */
        endPerformanceCounter(counterName: string): void;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
        /** @hidden */
        interface IEXTLightsImageBased_LightImageBased {
            _babylonTexture?: BaseTexture;
            _loaded?: Promise<void>;
        }
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_lights_image_based/README.md)
     */
    export class EXT_lights_image_based implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        private _lights?;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadSceneAsync(context: string, scene: IScene): Nullable<Promise<void>>;
        private _loadLightAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1691)
     * [Playground Sample](https://playground.babylonjs.com/#QFIGLW#9)
     * !!! Experimental Extension Subject to Changes !!!
     */
    export class EXT_mesh_gpu_instancing implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonTransformNode: TransformNode) => void): Nullable<Promise<TransformNode>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/EXT_meshopt_compression)
     *
     * This extension uses a WebAssembly decoder module from https://github.com/zeux/meshoptimizer/tree/master/js
     * @since 5.0.0
     */
    export class EXT_meshopt_compression implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadBufferViewAsync(context: string, bufferView: IBufferView): Nullable<Promise<ArrayBufferView>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_texture_webp/)
     */
    export class EXT_texture_webp implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        _loadTextureAsync(context: string, texture: ITexture, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_draco_mesh_compression)
     */
    export class KHR_draco_mesh_compression implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * The draco compression used to decode vertex data or DracoCompression.Default if not defined
         */
        dracoCompression?: DracoCompression;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        _loadVertexDataAsync(context: string, primitive: IMeshPrimitive, babylonMesh: Mesh): Nullable<Promise<Geometry>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_lights_punctual)
     */
    export class KHR_lights implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        private _lights?;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonTransformNode: TransformNode) => void): Nullable<Promise<TransformNode>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_pbrSpecularGlossiness)
     */
    export class KHR_materials_pbrSpecularGlossiness implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadSpecularGlossinessPropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_unlit)
     */
    export class KHR_materials_unlit implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadUnlitPropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_clearcoat/README.md)
     * [Playground Sample](https://www.babylonjs-playground.com/frame.html#7F7PN6#8)
     */
    export class KHR_materials_clearcoat implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadClearCoatPropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_sheen/README.md)
     * [Playground Sample](https://www.babylonjs-playground.com/frame.html#BNIZX6#4)
     */
    export class KHR_materials_sheen implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadSheenPropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_specular)
     */
    export class KHR_materials_specular implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadSpecularPropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_ior)
     */
    export class KHR_materials_ior implements IGLTFLoaderExtension {
        /**
         * Default ior Value from the spec.
         */
        private static readonly _DEFAULT_IOR;
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadIorPropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_variants/README.md)
     */
    export class KHR_materials_variants implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        private _variants?;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /**
         * Gets the list of available variant names for this asset.
         * @param rootMesh The glTF root mesh
         * @returns the list of all the variant names for this model
         */
        static GetAvailableVariants(rootMesh: Mesh): string[];
        /**
         * Gets the list of available variant names for this asset.
         * @param rootMesh The glTF root mesh
         * @returns the list of all the variant names for this model
         */
        getAvailableVariants(rootMesh: Mesh): string[];
        /**
         * Select a variant given a variant name or a list of variant names.
         * @param rootMesh The glTF root mesh
         * @param variantName The variant name(s) to select.
         */
        static SelectVariant(rootMesh: Mesh, variantName: string | string[]): void;
        /**
         * Select a variant given a variant name or a list of variant names.
         * @param rootMesh The glTF root mesh
         * @param variantName The variant name(s) to select.
         */
        selectVariant(rootMesh: Mesh, variantName: string | string[]): void;
        /**
         * Reset back to the original before selecting a variant.
         * @param rootMesh The glTF root mesh
         */
        static Reset(rootMesh: Mesh): void;
        /**
         * Reset back to the original before selecting a variant.
         * @param rootMesh The glTF root mesh
         */
        reset(rootMesh: Mesh): void;
        /**
         * Gets the last selected variant name(s) or null if original.
         * @param rootMesh The glTF root mesh
         * @returns The selected variant name(s).
         */
        static GetLastSelectedVariant(rootMesh: Mesh): Nullable<string | string[]>;
        /**
         * Gets the last selected variant name(s) or null if original.
         * @param rootMesh The glTF root mesh
         * @returns The selected variant name(s).
         */
        getLastSelectedVariant(rootMesh: Mesh): Nullable<string | string[]>;
        private static _GetExtensionMetadata;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        _loadMeshPrimitiveAsync(context: string, name: string, node: INode, mesh: IMesh, primitive: IMeshPrimitive, assign: (babylonMesh: AbstractMesh) => void): Nullable<Promise<AbstractMesh>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_materials_transmission/README.md)
     */
    export class KHR_materials_transmission implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadTransparentPropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Proposed Specification](https://github.com/KhronosGroup/glTF/pull/1825)
     * !!! Experimental Extension Subject to Changes !!!
     */
    export class KHR_materials_translucency implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadTranslucentPropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_materials_volume)
     * @since 5.0.0
     */
    export class KHR_materials_volume implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
        private _loadVolumePropertiesAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_mesh_quantization)
     */
    export class KHR_mesh_quantization implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_texture_basisu)
     */
    export class KHR_texture_basisu implements IGLTFLoaderExtension {
        /** The name of this extension. */
        readonly name: string;
        /** Defines whether this extension is enabled. */
        enabled: boolean;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        _loadTextureAsync(context: string, texture: ITexture, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_texture_transform)
     */
    export class KHR_texture_transform implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadTextureInfoAsync(context: string, textureInfo: ITextureInfo, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Khronos/KHR_xmp_json_ld)
     * @since 5.0.0
     */
    export class KHR_xmp_json_ld implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        private _loader;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /**
         * Called after the loader state changes to LOADING.
         */
        onLoading(): void;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/najadojo/glTF/tree/MSFT_audio_emitter/extensions/2.0/Vendor/MSFT_audio_emitter)
     */
    export class MSFT_audio_emitter implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        private _clips;
        private _emitters;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onLoading(): void;
        /** @hidden */
        loadSceneAsync(context: string, scene: IScene): Nullable<Promise<void>>;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonTransformNode: TransformNode) => void): Nullable<Promise<TransformNode>>;
        /** @hidden */
        loadAnimationAsync(context: string, animation: IAnimation): Nullable<Promise<AnimationGroup>>;
        private _loadClipAsync;
        private _loadEmitterAsync;
        private _getEventAction;
        private _loadAnimationEventAsync;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * [Specification](https://github.com/KhronosGroup/glTF/tree/master/extensions/2.0/Vendor/MSFT_lod)
     */
    export class MSFT_lod implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        /**
         * Defines a number that determines the order the extensions are applied.
         */
        order: number;
        /**
         * Maximum number of LODs to load, starting from the lowest LOD.
         */
        maxLODsToLoad: number;
        /**
         * Observable raised when all node LODs of one level are loaded.
         * The event data is the index of the loaded LOD starting from zero.
         * Dispose the loader to cancel the loading of the next level of LODs.
         */
        onNodeLODsLoadedObservable: Observable<number>;
        /**
         * Observable raised when all material LODs of one level are loaded.
         * The event data is the index of the loaded LOD starting from zero.
         * Dispose the loader to cancel the loading of the next level of LODs.
         */
        onMaterialLODsLoadedObservable: Observable<number>;
        private _loader;
        private _bufferLODs;
        private _nodeIndexLOD;
        private _nodeSignalLODs;
        private _nodePromiseLODs;
        private _nodeBufferLODs;
        private _materialIndexLOD;
        private _materialSignalLODs;
        private _materialPromiseLODs;
        private _materialBufferLODs;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        onReady(): void;
        /** @hidden */
        loadSceneAsync(context: string, scene: IScene): Nullable<Promise<void>>;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonTransformNode: TransformNode) => void): Nullable<Promise<TransformNode>>;
        /** @hidden */
        _loadMaterialAsync(context: string, material: IMaterial, babylonMesh: Nullable<Mesh>, babylonDrawMode: number, assign: (babylonMaterial: Material) => void): Nullable<Promise<Material>>;
        /** @hidden */
        _loadUriAsync(context: string, property: IProperty, uri: string): Nullable<Promise<ArrayBufferView>>;
        /** @hidden */
        loadBufferAsync(context: string, buffer: IBuffer, byteOffset: number, byteLength: number): Nullable<Promise<ArrayBufferView>>;
        private _loadBufferLOD;
        /**
         * Gets an array of LOD properties from lowest to highest.
         */
        private _getLODs;
        private _disposeTransformNode;
        private _disposeMaterials;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /** @hidden */
    export class MSFT_minecraftMesh implements IGLTFLoaderExtension {
        readonly name: string;
        enabled: boolean;
        private _loader;
        constructor(loader: GLTFLoader);
        dispose(): void;
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /** @hidden */
    export class MSFT_sRGBFactors implements IGLTFLoaderExtension {
        readonly name: string;
        enabled: boolean;
        private _loader;
        constructor(loader: GLTFLoader);
        dispose(): void;
        loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>>;
    }
}
declare module BABYLON.GLTF2.Loader.Extensions {
    /**
     * Store glTF extras (if present) in BJS objects' metadata
     */
    export class ExtrasAsMetadata implements IGLTFLoaderExtension {
        /**
         * The name of this extension.
         */
        readonly name: string;
        /**
         * Defines whether this extension is enabled.
         */
        enabled: boolean;
        private _loader;
        private _assignExtras;
        /** @hidden */
        constructor(loader: GLTFLoader);
        /** @hidden */
        dispose(): void;
        /** @hidden */
        loadNodeAsync(context: string, node: INode, assign: (babylonTransformNode: TransformNode) => void): Nullable<Promise<TransformNode>>;
        /** @hidden */
        loadCameraAsync(context: string, camera: ICamera, assign: (babylonCamera: Camera) => void): Nullable<Promise<Camera>>;
        /** @hidden */
        createMaterial(context: string, material: IMaterial, babylonDrawMode: number): Nullable<Material>;
    }
}
declare module BABYLON {
    /**
     * Class reading and parsing the MTL file bundled with the obj file.
     */
    export class MTLFileLoader {
        /**
         * Invert Y-Axis of referenced textures on load
         */
        static INVERT_TEXTURE_Y: boolean;
        /**
         * All material loaded from the mtl will be set here
         */
        materials: StandardMaterial[];
        /**
         * This function will read the mtl file and create each material described inside
         * This function could be improve by adding :
         * -some component missing (Ni, Tf...)
         * -including the specific options available
         *
         * @param scene defines the scene the material will be created in
         * @param data defines the mtl data to parse
         * @param rootUrl defines the rooturl to use in order to load relative dependencies
         * @param assetContainer defines the asset container to store the material in (can be null)
         */
        parseMTL(scene: Scene, data: string | ArrayBuffer, rootUrl: string, assetContainer: Nullable<AssetContainer>): void;
        /**
         * Gets the texture for the material.
         *
         * If the material is imported from input file,
         * We sanitize the url to ensure it takes the textre from aside the material.
         *
         * @param rootUrl The root url to load from
         * @param value The value stored in the mtl
         * @return The Texture
         */
        private static _getTexture;
    }
}
declare module BABYLON {
    /**
     * Options for loading OBJ/MTL files
     */
    export type OBJLoadingOptions = {
        /**
         * Defines if UVs are optimized by default during load.
         */
        optimizeWithUV: boolean;
        /**
         * Defines custom scaling of UV coordinates of loaded meshes.
         */
        UVScaling: Vector2;
        /**
         * Invert model on y-axis (does a model scaling inversion)
         */
        invertY: boolean;
        /**
         * Invert Y-Axis of referenced textures on load
         */
        invertTextureY: boolean;
        /**
         * Include in meshes the vertex colors available in some OBJ files.  This is not part of OBJ standard.
         */
        importVertexColors: boolean;
        /**
         * Compute the normals for the model, even if normals are present in the file.
         */
        computeNormals: boolean;
        /**
         * Optimize the normals for the model. Lighting can be uneven if you use OptimizeWithUV = true because new vertices can be created for the same location if they pertain to different faces.
         * Using OptimizehNormals = true will help smoothing the lighting by averaging the normals of those vertices.
         */
        optimizeNormals: boolean;
        /**
         * Skip loading the materials even if defined in the OBJ file (materials are ignored).
         */
        skipMaterials: boolean;
        /**
         * When a material fails to load OBJ loader will silently fail and onSuccess() callback will be triggered.
         */
        materialLoadingFailsSilently: boolean;
    };
}
declare module BABYLON {
    /**
     * Class used to load mesh data from OBJ content
     */
    export class SolidParser {
        /** Object descriptor */
        static ObjectDescriptor: RegExp;
        /** Group descriptor */
        static GroupDescriptor: RegExp;
        /** Material lib descriptor */
        static MtlLibGroupDescriptor: RegExp;
        /** Use a material descriptor */
        static UseMtlDescriptor: RegExp;
        /** Smooth descriptor */
        static SmoothDescriptor: RegExp;
        /** Pattern used to detect a vertex */
        static VertexPattern: RegExp;
        /** Pattern used to detect a normal */
        static NormalPattern: RegExp;
        /** Pattern used to detect a UV set */
        static UVPattern: RegExp;
        /** Pattern used to detect a first kind of face (f vertex vertex vertex) */
        static FacePattern1: RegExp;
        /** Pattern used to detect a second kind of face (f vertex/uvs vertex/uvs vertex/uvs) */
        static FacePattern2: RegExp;
        /** Pattern used to detect a third kind of face (f vertex/uvs/normal vertex/uvs/normal vertex/uvs/normal) */
        static FacePattern3: RegExp;
        /** Pattern used to detect a fourth kind of face (f vertex//normal vertex//normal vertex//normal)*/
        static FacePattern4: RegExp;
        /** Pattern used to detect a fifth kind of face (f -vertex/-uvs/-normal -vertex/-uvs/-normal -vertex/-uvs/-normal) */
        static FacePattern5: RegExp;
        private _loadingOptions;
        private _positions;
        private _normals;
        private _uvs;
        private _colors;
        private _meshesFromObj;
        private _handledMesh;
        private _indicesForBabylon;
        private _wrappedPositionForBabylon;
        private _wrappedUvsForBabylon;
        private _wrappedColorsForBabylon;
        private _wrappedNormalsForBabylon;
        private _tuplePosNorm;
        private _curPositionInIndices;
        private _hasMeshes;
        private _unwrappedPositionsForBabylon;
        private _unwrappedColorsForBabylon;
        private _unwrappedNormalsForBabylon;
        private _unwrappedUVForBabylon;
        private _triangles;
        private _materialNameFromObj;
        private _objMeshName;
        private _increment;
        private _isFirstMaterial;
        private _grayColor;
        private _materialToUse;
        private _babylonMeshesArray;
        /**
         * Creates a new SolidParser
         * @param materialToUse defines the array to fill with the list of materials to use (it will be filled by the parse function)
         * @param babylonMeshesArray defines the array to fill with the list of loaded meshes (it will be filled by the parse function)
         * @param loadingOptions defines the loading options to use
         */
        constructor(materialToUse: string[], babylonMeshesArray: Array<Mesh>, loadingOptions: OBJLoadingOptions);
        /**
         * Search for obj in the given array.
         * This function is called to check if a couple of data already exists in an array.
         *
         * If found, returns the index of the founded tuple index. Returns -1 if not found
         * @param arr Array<{ normals: Array<number>, idx: Array<number> }>
         * @param obj Array<number>
         * @returns {boolean}
         */
        private _isInArray;
        private _isInArrayUV;
        /**
         * This function set the data for each triangle.
         * Data are position, normals and uvs
         * If a tuple of (position, normal) is not set, add the data into the corresponding array
         * If the tuple already exist, add only their indice
         *
         * @param indicePositionFromObj Integer The index in positions array
         * @param indiceUvsFromObj Integer The index in uvs array
         * @param indiceNormalFromObj Integer The index in normals array
         * @param positionVectorFromOBJ Vector3 The value of position at index objIndice
         * @param textureVectorFromOBJ Vector3 The value of uvs
         * @param normalsVectorFromOBJ Vector3 The value of normals at index objNormale
         */
        private _setData;
        /**
         * Transform Vector() and BABYLON.Color() objects into numbers in an array
         */
        private _unwrapData;
        /**
         * Create triangles from polygons
         * It is important to notice that a triangle is a polygon
         * We get 5 patterns of face defined in OBJ File :
         * facePattern1 = ["1","2","3","4","5","6"]
         * facePattern2 = ["1/1","2/2","3/3","4/4","5/5","6/6"]
         * facePattern3 = ["1/1/1","2/2/2","3/3/3","4/4/4","5/5/5","6/6/6"]
         * facePattern4 = ["1//1","2//2","3//3","4//4","5//5","6//6"]
         * facePattern5 = ["-1/-1/-1","-2/-2/-2","-3/-3/-3","-4/-4/-4","-5/-5/-5","-6/-6/-6"]
         * Each pattern is divided by the same method
         * @param face Array[String] The indices of elements
         * @param v Integer The variable to increment
         */
        private _getTriangles;
        /**
         * Create triangles and push the data for each polygon for the pattern 1
         * In this pattern we get vertice positions
         * @param face
         * @param v
         */
        private _setDataForCurrentFaceWithPattern1;
        /**
         * Create triangles and push the data for each polygon for the pattern 2
         * In this pattern we get vertice positions and uvsu
         * @param face
         * @param v
         */
        private _setDataForCurrentFaceWithPattern2;
        /**
         * Create triangles and push the data for each polygon for the pattern 3
         * In this pattern we get vertice positions, uvs and normals
         * @param face
         * @param v
         */
        private _setDataForCurrentFaceWithPattern3;
        /**
         * Create triangles and push the data for each polygon for the pattern 4
         * In this pattern we get vertice positions and normals
         * @param face
         * @param v
         */
        private _setDataForCurrentFaceWithPattern4;
        private _setDataForCurrentFaceWithPattern5;
        private _addPreviousObjMesh;
        private _optimizeNormals;
        /**
         * Function used to parse an OBJ string
         * @param meshesNames defines the list of meshes to load (all if not defined)
         * @param data defines the OBJ string
         * @param scene defines the hosting scene
         * @param assetContainer defines the asset container to load data in
         * @param onFileToLoadFound defines a callback that will be called if a MTL file is found
         */
        parse(meshesNames: any, data: string, scene: Scene, assetContainer: Nullable<AssetContainer>, onFileToLoadFound: (fileToLoad: string) => void): void;
    }
}
declare module BABYLON {
    /**
     * OBJ file type loader.
     * This is a babylon scene loader plugin.
     */
    export class OBJFileLoader implements ISceneLoaderPluginAsync, ISceneLoaderPluginFactory {
        /**
         * Defines if UVs are optimized by default during load.
         */
        static OPTIMIZE_WITH_UV: boolean;
        /**
         * Invert model on y-axis (does a model scaling inversion)
         */
        static INVERT_Y: boolean;
        /**
         * Invert Y-Axis of referenced textures on load
         */
        static get INVERT_TEXTURE_Y(): boolean;
        static set INVERT_TEXTURE_Y(value: boolean);
        /**
         * Include in meshes the vertex colors available in some OBJ files.  This is not part of OBJ standard.
         */
        static IMPORT_VERTEX_COLORS: boolean;
        /**
         * Compute the normals for the model, even if normals are present in the file.
         */
        static COMPUTE_NORMALS: boolean;
        /**
         * Optimize the normals for the model. Lighting can be uneven if you use OptimizeWithUV = true because new vertices can be created for the same location if they pertain to different faces.
         * Using OptimizehNormals = true will help smoothing the lighting by averaging the normals of those vertices.
         */
        static OPTIMIZE_NORMALS: boolean;
        /**
         * Defines custom scaling of UV coordinates of loaded meshes.
         */
        static UV_SCALING: Vector2;
        /**
         * Skip loading the materials even if defined in the OBJ file (materials are ignored).
         */
        static SKIP_MATERIALS: boolean;
        /**
         * When a material fails to load OBJ loader will silently fail and onSuccess() callback will be triggered.
         *
         * Defaults to true for backwards compatibility.
         */
        static MATERIAL_LOADING_FAILS_SILENTLY: boolean;
        /**
         * Defines the name of the plugin.
         */
        name: string;
        /**
         * Defines the extension the plugin is able to load.
         */
        extensions: string;
        private _assetContainer;
        private _loadingOptions;
        /**
         * Creates loader for .OBJ files
         *
         * @param loadingOptions options for loading and parsing OBJ/MTL files.
         */
        constructor(loadingOptions?: OBJLoadingOptions);
        private static get DefaultLoadingOptions();
        /**
         * Calls synchronously the MTL file attached to this obj.
         * Load function or importMesh function don't enable to load 2 files in the same time asynchronously.
         * Without this function materials are not displayed in the first frame (but displayed after).
         * In consequence it is impossible to get material information in your HTML file
         *
         * @param url The URL of the MTL file
         * @param rootUrl defines where to load data from
         * @param onSuccess Callback function to be called when the MTL file is loaded
         */
        private _loadMTL;
        /**
         * Instantiates a OBJ file loader plugin.
         * @returns the created plugin
         */
        createPlugin(): ISceneLoaderPluginAsync | ISceneLoaderPlugin;
        /**
         * If the data string can be loaded directly.
         *
         * @param data string containing the file data
         * @returns if the data can be loaded directly
         */
        canDirectLoad(data: string): boolean;
        /**
         * Imports one or more meshes from the loaded OBJ data and adds them to the scene
         * @param meshesNames a string or array of strings of the mesh names that should be loaded from the file
         * @param scene the scene the meshes should be added to
         * @param data the OBJ data to load
         * @param rootUrl root url to load from
         * @param onProgress event that fires when loading progress has occured
         * @param fileName Defines the name of the file to load
         * @returns a promise containg the loaded meshes, particles, skeletons and animations
         */
        importMeshAsync(meshesNames: any, scene: Scene, data: any, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<ISceneLoaderAsyncResult>;
        /**
         * Imports all objects from the loaded OBJ data and adds them to the scene
         * @param scene the scene the objects should be added to
         * @param data the OBJ data to load
         * @param rootUrl root url to load from
         * @param onProgress event that fires when loading progress has occured
         * @param fileName Defines the name of the file to load
         * @returns a promise which completes when objects have been loaded to the scene
         */
        loadAsync(scene: Scene, data: string, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<void>;
        /**
         * Load into an asset container.
         * @param scene The scene to load into
         * @param data The data to import
         * @param rootUrl The root url for scene and resources
         * @param onProgress The callback when the load progresses
         * @param fileName Defines the name of the file to load
         * @returns The loaded asset container
         */
        loadAssetContainerAsync(scene: Scene, data: string, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<AssetContainer>;
        /**
         * Read the OBJ file and create an Array of meshes.
         * Each mesh contains all information given by the OBJ and the MTL file.
         * i.e. vertices positions and indices, optional normals values, optional UV values, optional material
         * @param meshesNames defines a string or array of strings of the mesh names that should be loaded from the file
         * @param scene defines the scene where are displayed the data
         * @param data defines the content of the obj file
         * @param rootUrl defines the path to the folder
         * @returns the list of loaded meshes
         */
        private _parseSolid;
    }
}
declare module BABYLON {
    /**
     * STL file type loader.
     * This is a babylon scene loader plugin.
     */
    export class STLFileLoader implements ISceneLoaderPlugin {
        /** @hidden */
        solidPattern: RegExp;
        /** @hidden */
        facetsPattern: RegExp;
        /** @hidden */
        normalPattern: RegExp;
        /** @hidden */
        vertexPattern: RegExp;
        /**
         * Defines the name of the plugin.
         */
        name: string;
        /**
         * Defines the extensions the stl loader is able to load.
         * force data to come in as an ArrayBuffer
         * we'll convert to string if it looks like it's an ASCII .stl
         */
        extensions: ISceneLoaderPluginExtensions;
        /**
         * Defines if Y and Z axes are swapped or not when loading an STL file.
         * The default is false to maintain backward compatibility. When set to
         * true, coordinates from the STL file are used without change.
         */
        static DO_NOT_ALTER_FILE_COORDINATES: boolean;
        /**
         * Import meshes into a scene.
         * @param meshesNames An array of mesh names, a single mesh name, or empty string for all meshes that filter what meshes are imported
         * @param scene The scene to import into
         * @param data The data to import
         * @param rootUrl The root url for scene and resources
         * @param meshes The meshes array to import into
         * @param particleSystems The particle systems array to import into
         * @param skeletons The skeletons array to import into
         * @param onError The callback when import fails
         * @returns True if successful or false otherwise
         */
        importMesh(meshesNames: any, scene: Scene, data: any, rootUrl: string, meshes: Nullable<AbstractMesh[]>, particleSystems: Nullable<IParticleSystem[]>, skeletons: Nullable<Skeleton[]>): boolean;
        /**
         * Load into a scene.
         * @param scene The scene to load into
         * @param data The data to import
         * @param rootUrl The root url for scene and resources
         * @param onError The callback when import fails
         * @returns true if successful or false otherwise
         */
        load(scene: Scene, data: any, rootUrl: string): boolean;
        /**
         * Load into an asset container.
         * @param scene The scene to load into
         * @param data The data to import
         * @param rootUrl The root url for scene and resources
         * @param onError The callback when import fails
         * @returns The loaded asset container
         */
        loadAssetContainer(scene: Scene, data: string, rootUrl: string, onError?: (message: string, exception?: any) => void): AssetContainer;
        private _isBinary;
        private _parseBinary;
        private _parseASCII;
    }
}