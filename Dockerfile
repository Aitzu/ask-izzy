ARG commonPackages='apt-transport-https \
    ca-certificates \
    nginx \
    parallel \
    wget'

FROM contyard.office.infoxchange.net.au/stretch-nodejs8 as test

ARG commonPackages

ENV DEBIAN_FRONTEND=noninteractive \
    NODE_ENV=production

VOLUME ["/static", "/storage"]

WORKDIR /app

COPY package.json yarn.lock /app/

RUN \
    useradd -d /app -r app && \
    mkdir -p /static /storage /app && \
    chown -R app /static /storage /app && \
    apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y --no-install-recommends install \
    ${commonPackages} \
    git \
    sudo \
    chromium \
    build-essential \
    python \
    libelf-dev && \
    npm install -g yarn && \
    yarn config set registry http://apt.office.infoxchange.net.au/npm && \
    yarn --frozen-lockfile && \
    yarn cache clean

# Install and build the app
ADD . /app

RUN git describe > public/VERSION && \
    script/build-assets && \
    script/build-gmaps-file && \
    chown -R app .

ENTRYPOINT ["./invoke.sh"]
EXPOSE 8000


FROM contyard.office.infoxchange.net.au/stretch

ARG commonPackages

ENV DEBIAN_FRONTEND=noninteractive

VOLUME ["/static", "/storage"]

RUN useradd -d /app -r app

WORKDIR /app

COPY --from=test /app /app

RUN apt-get -y update && \
    apt-get -y upgrade && \
    apt-get -y --no-install-recommends install \
        ${commonPackages} \
    && rm -rf /app/node_modules \
    && chown -R app .

ENTRYPOINT ["./invoke.sh"]
EXPOSE 8000
