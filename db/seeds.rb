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
  question_text: 'Does your child already have a cast? Do they complain of it being too tight? Does it feel normal or tingly?'
)
TriageQuestion.create!(
  question_text: 'Is your child in pain? Where? What happened? Have they been given Tylenol or Advil? What makes the pain worse or better?'
)
TriageQuestion.create!(
  question_text: 'Is your child having difficulty walking?'
)
TriageQuestion.create!(
  question_text: 'What is the child\'s respiratory rate? Are the wheezing, coughing, or breathing harder than normal?'
)
TriageQuestion.create!(
  question_text: 'What is the child\'s temperature?'
)
TriageQuestion.create!(
  question_text: 'Is your child experiencing vertigo?'
)
TriageQuestion.create!(
  question_text: 'Is your child anxious or combative?'
)
TriageQuestion.create!(
  question_text: 'Is your child able to speak in complete sentences?'
)
# fill these out properly once available...

p "Created #{TriageQuestion.count} triage questions!"

p 'DONE!'
