class ProxyController < ApplicationController
  def proxy
    require 'net/http'
    require 'net/https'

    @api_key = '000000'

    @payload = {
      "type"     => "email",
      "customer" => params[:customer],
      "subject"  => params[:subject],
      "mailbox"  => {
          "id" => params[:mailbox][:id].to_f
      },
      "threads"  => [ params[:threads]["0"] ]
    }.to_json

    uri = URI.parse("https://api.helpscout.net/v1/conversations.json")
    https = Net::HTTP.new(uri.host,uri.port)
    https.use_ssl = true

    req = Net::HTTP::Post.new(uri.request_uri, initheader = {"Content-Type" => "application/json"})
    req.basic_auth @api_key, "X"
    req.body = @payload

    res = https.request(req)

    render :status => res.code, :json => res.body
  rescue => e
    render :status => :internal_server_error, :json => {"error" => "failed #{e}"}
  end
end
