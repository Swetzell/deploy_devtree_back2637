import mongoose, { Schema } from "mongoose";

interface IProfileVisit {
  profileId: mongoose.Types.ObjectId;
  visitorId: mongoose.Types.ObjectId | null; // null para visitas anónimas
  date: Date;
  referrer: string | null; // de dónde vino la visita
}

const profileVisitSchema = new Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // visitas anónimas
  },
  date: {
    type: Date,
    default: Date.now,
  },
  referrer: {
    type: String,
    default: null,
  }
}, {
  timestamps: true
});

// Índice para búsquedas rápidas por perfil y fecha
profileVisitSchema.index({ profileId: 1, date: -1 });

const ProfileVisit = mongoose.model<IProfileVisit>("ProfileVisit", profileVisitSchema);
export default ProfileVisit;
