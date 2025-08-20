const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
require('dotenv').config();

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123',
    role: 'jobseeker',
    phone: '+1234567890',
    jobSeekerProfile: {
      headline: 'Full Stack Developer',
      summary: 'Experienced developer with 5+ years in web development',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      location: 'New York, NY',
      salary: 80000,
      availability: 'immediately'
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@techcorp.com',
    password: 'Password123',
    role: 'employer',
    phone: '+1987654321',
    employerProfile: {
      companyName: 'TechCorp Solutions',
      companySize: '51-200',
      industry: 'Technology',
      website: 'https://techcorp.com',
      description: 'Leading technology solutions provider'
    }
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@startup.com',
    password: 'Password123',
    role: 'employer',
    phone: '+1555666777',
    employerProfile: {
      companyName: 'StartupXYZ',
      companySize: '11-50',
      industry: 'Startup',
      website: 'https://startupxyz.com',
      description: 'Innovative startup disrupting the market'
    }
  }
];

const sampleJobs = [
  {
    title: 'Senior React Developer',
    location: 'San Francisco, CA',
    type: 'full-time',
    category: 'Software Development',
    experience: 'senior',
    salary: { min: 120000, max: 180000, currency: 'USD', period: 'yearly' },
    description: 'We are looking for a senior React developer to join our team and help build amazing user experiences.',
    requirements: ['5+ years React experience', 'Strong JavaScript skills', 'Team leadership experience'],
    responsibilities: ['Lead development team', 'Architect React applications', 'Mentor junior developers'],
    benefits: ['Health insurance', '401k matching', 'Flexible work hours', 'Remote work options'],
    skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'GraphQL'],
    education: 'bachelor',
    remote: 'hybrid',
    visaSponsorship: true,
    relocation: true
  },
  {
    title: 'UX/UI Designer',
    location: 'New York, NY',
    type: 'full-time',
    category: 'Design',
    experience: 'mid',
    salary: { min: 80000, max: 120000, currency: 'USD', period: 'yearly' },
    description: 'Join our design team to create beautiful and functional user interfaces.',
    requirements: ['3+ years design experience', 'Proficiency in Figma', 'Portfolio required'],
    responsibilities: ['Design user interfaces', 'Create design systems', 'Collaborate with developers'],
    benefits: ['Health insurance', 'Dental coverage', 'Professional development', 'Creative environment'],
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
    education: 'bachelor',
    remote: 'on-site',
    visaSponsorship: false,
    relocation: false
  },
  {
    title: 'DevOps Engineer',
    location: 'Austin, TX',
    type: 'full-time',
    category: 'DevOps',
    experience: 'mid',
    salary: { min: 90000, max: 140000, currency: 'USD', period: 'yearly' },
    description: 'Help us build and maintain our cloud infrastructure and deployment pipelines.',
    requirements: ['3+ years DevOps experience', 'AWS/Azure knowledge', 'Docker and Kubernetes'],
    responsibilities: ['Manage cloud infrastructure', 'Automate deployments', 'Monitor system health'],
    benefits: ['Health insurance', '401k', 'Home office setup', 'Conference attendance'],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux'],
    education: 'bachelor',
    remote: 'remote',
    visaSponsorship: true,
    relocation: true
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

// Seed users
async function seedUsers() {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    throw error;
  }
}

// Seed jobs
async function seedJobs(users) {
  try {
    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Cleared existing jobs');

    // Get employer users
    const employers = users.filter(user => user.role === 'employer');
    
    // Create jobs with employer references
    const jobsWithEmployers = sampleJobs.map((job, index) => ({
      ...job,
      company: employers[index % employers.length]._id,
      companyName: employers[index % employers.length].employerProfile.companyName
    }));

    const createdJobs = await Job.create(jobsWithEmployers);
    console.log(`✅ Created ${createdJobs.length} jobs`);

    return createdJobs;
  } catch (error) {
    console.error('❌ Error seeding jobs:', error.message);
    throw error;
  }
}

// Main seeding function
async function seedData() {
  try {
    console.log('🌱 Starting database seeding...\n');

    await connectDB();
    
    const users = await seedUsers();
    const jobs = await seedJobs(users);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Users: ${users.length}`);
    console.log(`📊 Jobs: ${jobs.length}`);
    
    // Display sample data
    console.log('\n👥 Sample Users:');
    users.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.role})`);
    });

    console.log('\n💼 Sample Jobs:');
    jobs.forEach(job => {
      console.log(`   - ${job.title} at ${job.companyName}`);
    });

    console.log('\n🔗 You can now test the API endpoints!');
    console.log('   - Health check: GET /api/health');
    console.log('   - Jobs: GET /api/jobs');
    console.log('   - Featured jobs: GET /api/jobs/featured');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData, connectDB };
