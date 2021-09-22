export class Page{
    id: string;
    title: string;
    routeName: string;
    htmlText: string;
    status: boolean;

    constructor(){
        this.htmlText="";
    }

    static toJson(pagesJson: Page[]): Page[] {
        var pages: Array<Page> = [];
        for(var page of pagesJson){
            var mPage = new Page();
            mPage.id = page['id'];
            mPage.title = page['title'];
            mPage.routeName = page['routeName'];
            mPage.status = page['status']===undefined?true:false;
            pages.push(mPage);
        }
        return pages;
    }
}