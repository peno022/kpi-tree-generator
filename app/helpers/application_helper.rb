# frozen_string_literal: true

module ApplicationHelper
  # rubocop:disable Metrics/MethodLength
  def default_meta_tags
    {
      site: '簡単・無料で使えるKPIツリーメーカー',
      reverse: true,
      charset: 'utf-8',
      description: '簡単にKPIツリーを作成できるツール。無料で利用可能です。',
      viewport: 'width=device-width, initial-scale=1.0',
      og: {
        title: :title,
        type: 'website',
        site_name: '簡単・無料で使えるKPIツリーメーカー',
        description: :description,
        image: 'https://kpi-tree.com/ogp/ogp.png',
        url: 'https://kpi-tree.com'
      },
      twitter: {
        card: 'summary',
        site: '@peno022',
        description: :description,
        image: 'https://kpi-tree.com/ogp/ogp.png',
        domain: 'https://kpi-tree.com'
      }
    }
  end
  # rubocop:enable Metrics/MethodLength
end
