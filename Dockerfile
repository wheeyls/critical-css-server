FROM node:current-bullseye

ENV APP_HOME /app_home
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
ADD . $APP_HOME

RUN apt-get update && apt-get install -y chromium libnss3 gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation lsb-release xdg-utils wget

# Install latest chrome dev package.
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
#RUN apt-get update && apt-get install -y wget --no-install-recommends \
#  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#  && apt-get update \
#  && apt-get install -y google-chrome-stable \
#  --no-install-recommends \
#  && rm -rf /var/lib/apt/lists/* \
#  && apt-get purge --auto-remove -y curl \
#  && rm -rf /src/*.deb

#RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && apt install ./google-chrome-stable_current_amd64.deb


ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
#ENV PUPPETEER_EXECUTABLE_PATH which chromium`

# Install puppeteer so it's available in the container.
RUN yarn add puppeteer

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
