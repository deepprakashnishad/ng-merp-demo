export class Banner{
    id: string;
    name: string;
    url: string;
    uploadPath; string;
    link: string;
    index: string;
    bannerText: string;
    bannerType: string;

    constructor(){
        this.uploadPath = "banner/"
        this.bannerType = "only_image";
    }
}