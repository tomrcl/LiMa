// patiente-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const patiente = new Schema({
    nomJf: { type: String, required: [true, 'Nom de jeune fille requis'] },
    nom: String,
    prenom: String,
    dateNaissance: String,
    adresse: String,
    telephone: String,
    email: String,
    activite: String,
    statut: String,
    medecinTraitant: {
      nom: String,
      ville: String
    },
    sfGyneco: {
      nom: String,
      ville: String
    },
    partenaire: {
      nom: String,
      prenom: String,
      dateNaissance: Date,
      activite: String
    },
    specialistes: String,
    allergies: String,
    groupeSanguin: {
      groupe: String,
      rhesus: String,
      carteAjour: String
    },
    antecedents: {
      familiaux: {
        aucun: String,
        diabete: String,
        obesite: String,
        hta: String,
        cardiovasculaires: String,
        cancershormonodependants: String
      },
      medicaux: {
        aucun: String,
        asthme: String,
        migraines: String,
        autres: String
      },
      chirurgicaux: {
        aucun: String,
        appendicectomie: String,
        dds: String,
        autres: String
      }
    },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }

  });

  return mongooseClient.model('patiente', patiente);
};
