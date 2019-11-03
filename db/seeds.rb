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
unless Rails.env.development?
  puts 'Development seeds only (for now)!'
  exit 0
end

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
  question_text: 'Is your child\'s temperature over 39 degrees Celcius?'
)
TriageQuestion.create!(
  question_text: 'Is your child showing any signs of rashing on their face?'
)
TriageQuestion.create!(
  question_text: 'Is your child able to breathe normally?'
)
# fill these out properly once available...

p "Created #{TriageQuestion.count} triage questions!"

p 'DONE!'
