# frozen_string_literal: true

module ApplicationHelper
  # rubocop:disable Metrics/MethodLength
  def default_meta_tags
    {
      site: 'KPI TREE MAKER',
      reverse: true,
      charset: 'utf-8',
      description: 'KPI ツリーが無料で簡単につくれる Web サービスです。',
      viewport: 'width=device-width, initial-scale=1.0',
      og: {
        title: :title,
        type: 'website',
        site_name: 'KPI TREE MAKER',
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
