# frozen_string_literal: true

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
p 'Seeding Data ...'

# Only run on development (local) instances not on production, etc.
# unless Rails.env.development?
#   puts 'Development seeds only (for now)!'
#   exit 0
# end

# Let's do this ...

## EMERGENCY ROOMS

EmergencyRoom.destroy_all

EmergencyRoom.create!(
  hospital_name: 'Rockyview General Hospital',
  address: '7007 14 St SW, Calgary, AB T2V 1P9'
)
EmergencyRoom.create!(
  hospital_name: 'Alberta Children\'s Hospital',
  address: '28 Oki Dr, Calgary, AB T3B 6A8'
)
EmergencyRoom.create!(
  hospital_name: 'Foothills Hospital',
  address: '1403 29 St NW, Calgary, AB T2N 2T9'
)
EmergencyRoom.create!(
  hospital_name: 'Peter Lougheed Hospital',
  address: '3500 26 Ave NE, Calgary, AB T1Y 6J4'
)
EmergencyRoom.create!(
  hospital_name: 'South Health Campus',
  address: '4448 Front St SE, Calgary, AB T3M 1M4'
)


p "Created #{EmergencyRoom.count} Emergency Rooms!"

## USERS

User.destroy_all

parent1 = User.new(
  first_name: 'Bob',
  last_name: 'Smith',
  email: 'bob@smith.com',
  phone: '1234567',
  password: 'password',
  role: 'caregiver'
)
parent1.hash_password
parent1.save
nurse1 = User.new(
  first_name: 'Nurse',
  last_name: 'Jackie',
  email: 'jackie@ahs.com',
  phone: '1234567',
  password: 'password',
  role: 'triage_staff'
)
nurse1.hash_password
nurse1.save

p "Created #{User.count} users!"

## Triage Questions

TriageQuestion.destroy_all

TriageQuestion.create!(
  question_text: 'Is your child experiencing any pain? (Try to be as specific as you can. E.g.: Left wrist closest to the thumb). If so, when did the pain start? What makes the pain better or worse?'
)
TriageQuestion.create!(
  question_text: 'Is the child conscious? Are they responding to you like they usually do? Is your child able to recognize you?'
)
TriageQuestion.create!(
  question_text: 'Is the child able to keep fluids down? (i.e., are they tolerating water, soups, or other liquids?)'
)
TriageQuestion.create!(
  question_text: 'Is your child having difficulty breathing? Can you hear them wheeze or cough? If so, how often? When does it happen?'
)
TriageQuestion.create!(
  question_text: 'What is the child’s temperature? (please indicate temperature method and measurement in Celcius or Farenheit)'
)
TriageQuestion.create!(
  question_text: 'Is the child having difficulty walking? Do they appear to be dizzy or light-headed?'
)
TriageQuestion.create!(
  question_text: 'Does your child already have a cast currently on for a broken or fractured bone? Do they complain that it is too tight? Does it feel “normal” or tingly?'
)
TriageQuestion.create!(
  question_text: 'Does your child take any scheduled medications? If so, what are they? Did your child take any medications related to the health concern you are submitting this request for? If so, what was it and what time was it taken?'
)
TriageQuestion.create!(
  question_text: 'How does your child communicate best? (Does your child use visual communication supports to communicate?)'
)
TriageQuestion.create!(
  question_text: 'Does your child have any behaviours that we should be aware of? (Aggressive behaviours, pulling hair, etc)'
)
TriageQuestion.create!(
  question_text: 'How does your child respond to pain, stress, and meeting new people?'
)
TriageQuestion.create!(
  question_text: 'Does your child have specific sensory triggers? What would help to make this a more comfortable visit for them?'
)

p "Created #{TriageQuestion.count} triage questions!"

p 'DONE!'
