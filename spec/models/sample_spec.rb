# frozen_string_literal: true

describe 'sample true' do
  it 'returns true' do
    truthy = true
    expect(truthy).to eq(true)
  end

  it 'returns false' do
    falsy = false
    expect(falsy).to eq(false)
  end
end
