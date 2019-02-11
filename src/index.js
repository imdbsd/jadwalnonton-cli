const program = require('commander');
const axios = require('axios');
const inquirer = require('inquirer');

program
  .version('0.0.1')
  .description('jadwalnonton.com unofficial CLI tool')
  .option('-a, --area <area>')
  .option('-t, --theater <theater>')
  .option('-m, --movie <movie>')
  .action(options => {
    // console.log({ options });
    console.log(options.area);
    console.log(options.theater);
    console.log(options.movie);
    if(!options.area) {
      inquirer
      .prompt([
        {
          type: 'list',
          name: 'area',
          message: 'where is your region?',
          choices: [
            'bali', 'jakarta', 'surabaya', 'next'
          ]
        }
      ])
      .then(answers => {
        console.log(answers)
        if(answers === 'next') {
          prompt([
            
          ])
        }
      });
    }
  })
  .parse(process.argv);

// program
//   .command("addContact <firstame> <lastname> <phone> <email>")
//   .alias("a")
//   .description("Add a contact")
//   .action((firstname, lastname, phone, email) => {
//     console.log({ firstname, lastname, phone, email });
//   });

// program
//   .command("getContact")
//   .option("-l, --locale <locale>")
//   .option("-t, --theater <theater>")
//   .description("Get contact")
//   .action(options => {
//     console.log({ options });
//     console.log(options.locale);
//   });

// program.parse(process.argv);
