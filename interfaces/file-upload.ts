

export interface FileUpload {
    name: string;
    data: string;
    enconding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;

    mv: Function;

}