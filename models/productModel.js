const mongoose = require('mongoose');
// const slugify = require('slugify');
// const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    id: {
        type: Number,
        unique: true,
        required: [true, 'Id missing'],
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Title missing'],
    },
    price: {
        type: Number,
        min: 0,
        required: [true, 'Price missing'],
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    category: {
        type: String,
        required: [true, 'Category missing'],
        // Add some kind of enum?
    },
    image: {
        type: String,
        required: [true, 'Image missing'],
        trim: true,
    },
    rating: {
        rate: {
            type: Number,
            min: 0,
        },
        count: {
            type: Number,
            min: 0,
        }
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// // DOCUMENT MIDDLEWARE: runs before .save() and .create()
// tourSchema.pre('save', function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// // tourSchema.pre('save', function(next) {
// //   console.log('Will save document...');
// //   next();
// // });

// // tourSchema.post('save', function(doc, next) {
// //   console.log(doc);
// //   next();
// // });

// // QUERY MIDDLEWARE
// // tourSchema.pre('find', function(next) {
// tourSchema.pre(/^find/, function(next) {
//   this.find({ secretTour: { $ne: true } });

//   this.start = Date.now();
//   next();
// });

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// // AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
