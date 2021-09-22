export class Rating{
    stars: number;
    comment: string;
    recipientId: string;
    recipientType: string;
    byPerson: string;
    byPersonName: string;
    updatedAt: any;

    static fromJson(data){
        var ratings = new Array<Rating>();
        data.forEach(element => {
            var rating = new Rating();
            rating.stars = element['stars'];
            rating.comment = element['comment'];
            rating.recipientId = element['recipientId'];
            rating.recipientType = element['recipientType'];
            rating.byPerson = element['byPerson'];
            rating.byPersonName = element['byPersonName'];
            rating.updatedAt = element['updatedAt'];
        });
    }
}