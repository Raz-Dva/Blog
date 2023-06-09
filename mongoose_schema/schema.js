const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const articleScheme = new Schema({
    author: {
        type: String,
        reuqire: true
    },
    title: {
        type: String,
        reuqire: true,
        default: "NoName"
    },
    text: {
        type: String,
        reuqire: true
    },
    img:
    {
        data: Buffer,
        contentType: String
    },
    date: {
        type: Date,
        reuqire: true,
        default: Date.now
    },
    categories: {
        type: Array
    }
});

module.exports = mongoose.model('article', articleScheme);

// mongoose.connect("mongodb://localhost:27017/db_articles", { useNewUrlParser: true });

// const Article = mongoose.model('article', articleScheme);
// const art = new Article({
//     author: 'Blaise Cendrars',
//     title: '',
//     text: `He was born in La Chaux-de-Fonds, Neuchâtel, Switzerland, rue de la Paix 27,[1] into a bourgeois francophone family, to a Swiss father and a Scottish mother.[2] They sent young Frédéric to a German boarding school, but he ran away. At the Realschule in Basel in 1902 he met his lifelong friend the sculptor August Suter. Next they enrolled him in a school in Neuchâtel, but he had little enthusiasm for his studies. Finally, in 1904, he left school due to poor performance and began an apprenticeship with a Swiss watchmaker in Russia.
//         While living in St. Petersburg, he began to write, thanks to the encouragement of R.R., a librarian at the National Library of Russia. There he wrote the poem, "La Légende de Novgorode", which R.R. translated into Russian. Supposedly fourteen copies were made, but Cendrars claimed to have no copies of it, and none could be located during his lifetime. In 1995, the Bulgarian poet Kiril Kadiiski claimed to have found one of the Russian translations in Sofia, but the authenticity of the document remains contested on the grounds of factual, typographic, orthographic, and stylistic analysis.[3]    
//         In 1907, Sauser returned to Switzerland, where he studied medicine at the University of Berne. During this period, he wrote his first verified poems, Séquences, influenced by Remy de Gourmont's Le Latin mystique.`,
//     img: '/public/img/blog-img/1.jpg',
//     date: '12.10.2020',
//     categories: ['LifeStyle', 'Sport', 'Photography', 'Health Food', 'Life']
// });

// art.save().then(function(doc){
//     console.log("Сохранен объект", doc);
//     mongoose.disconnect();  // отключение от базы данных
// })
// .catch(function (err){
//     console.log(err);
//     mongoose.disconnect();
// });