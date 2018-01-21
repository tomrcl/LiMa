// patiente-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const patiente = new Schema({
    nomJf: String,
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
    allergies: {
      ouinon: String,
      autres: String
    },
    groupeSanguin: {
      groupe: String,
      rhesus: String,
      carteAjour: String,
      pere: {
        groupe: String,
        rhesus: String,
        carteAjour: String
      }
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
    createdAt: Date,
    updatedAt: { type: Date, 'default': Date.now }

  });

  return mongooseClient.model('patiente', patiente);
};
