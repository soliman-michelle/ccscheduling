// // sum of all courses with its blocks
// total_classes = summation(coursesPerSemProgram*block);

// while (total_classes != 0) //106 
// {
//     //decrement everytime nonLab is called.
// 	nonLab();
// 	Lab();
	
// 	profSpecialized($prof);
// } 

// function nonLab(){
// 	1. select number of nonLab in sem // 10
// 	2. iterate

// 	while(nonLab != 0){
// 		getCourse; //Discrete Math or thesis 2
// 		getHours; // 3
// 		getBlock; //7 or 2
// 		getAllProfSpecialized; //4

// 		if(getAllProfSpecialized > 1) // if course has more than 1 prof
// 		{
// 			Math.floor(random * (block/getAllProfSpecialized)); // (7/3) * random(1,2)
// 			if(profTimeAvailability > 0 && course_prep <= $maxPrep && status == available){
// 				pick prof, search already assign classes;
// 				array(prof, course, block, duration * block); // Ritardo, discrete Math, A, B, C 3*3 = 9 hours, 1 subject and 3 blocks. 
// 			}else {
// 				"Sorry unavailable!"
// 				remove prof from getAllProfSpecialized and choose another prof
// 			}
// 		}else{
// 			//if course has only 1 prof, assign it
// 			check profTimeAvailability;
// 			if(profTimeAvailability > 0 && course_prep <= $maxPrep && status == available){
// 				array(prof, course, block, duration * block); // Aguado, thesis 2, 3*2 = 6 hours
// 			}
// 		}
		
// 		profTimeAvailability - duration * block;
//         total_classes--;
//         nonLab--;
// 	}
// }

// function Lab() {
// 	1. select number of Lab in sem // 20
// 	2. iterate

// 	while(Lab != 0){
// 		getCourse; //Comprog 3
// 		getHours; // 5
// 		getBlock; //9
// 		getAllProfSpecialized; //5

// 		if(getAllProfSpecialized > 1) // if course has more than 1 prof
// 		{
// 			Math.floor(random * (block/getAllProfSpecialized)); // (7/3) * random(1,2)
// 			if(profTimeAvailability > 0 && course_prep <= $maxPrep){
// 				pick prof, search already assign classes;
// 				array(prof, course, block, duration * block); // Ritardo, discrete Math, 3*3 = 9 hours
// 			}else {
// 				"Sorry unavailable!"
// 				remove prof from getAllProfSpecialized and choose another prof
// 			}
// 		}else{
// 			//if course has only 1 prof, assign it
// 			check profTimeAvailability;
// 			if(profTimeAvailability > 0 && course_prep <= $maxPrep){
// 				array(prof, course, block, duration * block); // Aguado, thesis 2, 3*2 = 6 hours

// 			}
// 		}
		
// 		profTimeAvailability - duration * block;
//         total_classes--;
//         Lab--;
// 	}
// }
// function profSpecialized($prof){
    
// }