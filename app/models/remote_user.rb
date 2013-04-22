require 'typhoid'

class RemoteUser < Typhoid::Resource
  field :city
  field :confirmation_sent_at
  field :confirmation_token
  field :confirmed_at
  field :created_at
  field :current_sign_in_at
  field :current_sign_in_ip
  field :email
  field :enabled
  field :encrypted_password
  field :fax
  field :first_name
  field :forem_admin
  field :forem_auto_subscribe
  field :forem_state
  field :id
  field :last_name
  field :last_sign_in_at
  field :last_sign_in_ip
  field :member_until
  field :membership_level
  field :organization
  field :phone
  field :postal_code
  field :province
  field :rejected
  field :remember_created_at
  field :reset_password_sent_at
  field :reset_password_token
  field :seen
  field :sign_in_count
  field :street_address
  field :title
  field :updated_at
  field :username
  field :website

  self.site = 'http://localhost:8888/'  # The base-url for where we plan to retrieve data
  self.path = 'users'                  # Specific path to get the data for this Class

  def self.get_user_by_username(username)
    request = build_request("#{site}#{path}.json?search[username]=#{username}")
    user = self.run(request).first
  end
  
end