import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const indianNames = [
  'Aarav Patel',
  'Amit Kumar',
  'Ananya Singh',
  'Aditya Sharma',
  'Akanksha Gupta',
  'Bhavya Reddy',
  'Bhavesh Jain',
  'Chetan Desai',
  'Chitra Iyer',
  'Chirag Malhotra',
  'Deepak Verma',
  'Dhruv Saxena',
  'Divya Thakur',
  'Ekta Kapoor',
  'Esha Joshi',
  'Farhan Sheikh',
  'Fatima Khan',
  'Gaurav Sharma',
  'Geeta Mehta',
  'Gopal Singh',
  'Harshita Gupta',
  'Hemant Patel',
  'Ishita Chopra',
  'Imran Khan',
  'Jatin Singh',
  'Jyoti Sharma',
  'Jai Kumar',
  'Kunal Gupta',
  'Kritika Verma',
  'Kapil Chauhan',
  'Lakshmi Iyer',
  'Lalit Singh',
  'Megha Mishra',
  'Mohit Jain',
  'Neha Gupta',
  'Naman Sharma',
  'Nisha Patel',
  'Nitin Yadav',
  'Ojasvi Kapoor',
  'Om Sharma',
  'Pooja Gupta',
  'Pranav Singh',
  'Priya Mehra',
  'Prateek Patel',
  'Qamar Ali',
  'Rajesh Singh',
  'Ritu Sharma',
  'Ravi Verma',
  'Riya Gupta',
  'Sachin Kumar',
  'Shreya Singh',
  'Shubham Patel',
  'Sneha Jain',
  'Tarun Gupta',
  'Tanvi Sharma',
  'Utkarsh Singh',
  'Urvashi Patel',
  'Vikram Singh',
  'Vaishali Sharma',
  'Vivek Gupta',
  'Vandana Singh',
  'Yash Patel',
  'Yashika Gupta',
  'Yuvraj Singh',
  'Zoya Khan',
  'Zain Ahmed',
  'Zubin Patel',
  'Zoya Khan',
  'Veer Singh',
  'Vaani Sharma',
  'Vedant Verma',
  'Vidya Kapoor',
  'Vikrant Gupta'
];

const getRandomIndianName = () => sample(indianNames);

export const leads = [...Array(70)].map((_, index) => ({
  id: faker.string.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  // name: faker.person.fullName(),
  name: getRandomIndianName(), // Reverting back to normal Indian names

  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
}));
