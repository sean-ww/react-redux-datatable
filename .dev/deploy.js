const ghpages = require('gh-pages');
const rimraf = require('rimraf');

const targetDirectory = '.couscous';

const cleanUpDirectory = () => rimraf(targetDirectory, () => {
  console.log('Clean up complete.');
});

const deployDirectoryToGitHub = () => {
  console.log(`Deploying ${targetDirectory} directory to GitHub`);
  ghpages.publish(`${targetDirectory}/generated`, error => {
    if (error) return console.log(error);
    cleanUpDirectory();
  });
};

deployDirectoryToGitHub();
