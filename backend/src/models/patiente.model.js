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
    taille: Number,
    poids: Number,
    tabac: {
      ouinon: String,
      autres: String
    },
    alcool: {
      ouinon: String,
      autres: String
    },
    toxiques: {
      ouinon: String,
      autres: String
    },
    antecedents: {
      familiaux: {
        aucun: Boolean,
        diabete: Boolean,
        obesite: Boolean,
        hta: Boolean,
        cardiovasculaires: Boolean,
        cancershormonodependants: String
      },
      medicaux: {
        aucun: Boolean,
        asthme: Boolean,
        migraines: Boolean,
        autres: String
      },
      chirurgicaux: {
        aucun: String,
        appendicectomie: String,
        dds: String,
        autres: String
      },
      gynecologiques: {
        aucun: String,
        kystesovaire: String,
        fibromesuterins: String,
        endometriose: String,
        hysterectomie: String,
        autres: String
      },
      obstetricaux: [{
        date: Date,
        terme: String,
        grossesse: String,
        modeAccouchement: String,
        nouveauNe: String,
        allaitement: String,
        perinee: String
      }]
    },
    cyclesreguliers: {
      ouinon: String,
      autres: String
    },
    vaccinationhpv: String,
    dernierfrottis: {
      date: Date,
      resultat: String
    },
    contraception: {
      aucun: String,
      estroprogestatifs: String,
      microprogestatifs: String,
      monoprogestatifs: String,
      diuSiu: String,
      localeBarriere: String,
      naturelle: String,
      localeBarriere: String,
      autre: String
    },
    age: {
      premieresregles: String,
      premiersrapports: String
    },
    consultations: {
      autre:[{
        libelle: String,
        date: Date,
        description: String
      }],
      entretienPrenatal:[{
        date:Date,
        description: String
      }],
      reeducPerinee:[{
        numero: String,
        date:Date,
        description: String
      }]
    },
    createdAt: Date,
    updatedAt: { type: Date, 'default': Date.now }
  });

  return mongooseClient.model('patiente', patiente);
};
