'use strict';

exports = module.exports = function(app, mongoose) {
    var eventSchema = new mongoose.Schema({

        pivot: { type: String, default: '' },
        name: { type: String, required: true },
        description: { type: String },
        venue: { type: String },
        date: { type: Date },
        startTime: { type: String },
        endDate: { type: String },
        username: { type: String, required: true },

    });
    eventSchema.plugin(require('./plugins/pagedFind'));
    eventSchema.index({ pivot: 1 });
    eventSchema.index({ name: 1 });
    eventSchema.index({ username: 1 });
    eventSchema.index({ date: 1 });
    eventSchema.index({ venue: 1 });
    eventSchema.index({ startTime: 1 });
    eventSchema.index({ endTime: 1 });
    eventSchema.index({ search: 1 });
    eventSchema.set('autoIndex', (app.get('env') === 'development'));
    app.db.model('Event', eventSchema);
};