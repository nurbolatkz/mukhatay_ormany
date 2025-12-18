// .pnpmfile.cjs
module.exports = {
  hooks: {
    // Reduce concurrency to avoid memory issues
    readPackage(pkg) {
      // Any package transformations can go here if needed
      return pkg;
    }
  }
};