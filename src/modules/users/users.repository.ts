import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { v4 as uuid } from 'uuid';
import { UpdateUserDTO } from './dto/req';
import { SignUpDTO } from '../auth/dto/req';
import AddressEntity from './interfaces/address';
import ProfileEntity from './interfaces/profile';
import UserEntity from './interfaces/user';

@Injectable()
export default class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectKnex() private readonly db: Knex) {
    this.logger.debug({ DB: this.db.client.config }, 'injected knex instance');
  }

  async save(data: SignUpDTO): Promise<string> {
    const trx = await this.db.transaction();
    try {
      const userData: UserEntity = {
        id: uuid(),
        username: data.username,
        password: data.password,
      };
      await this.db('user').insert(userData).transacting(trx);

      const addressData: AddressEntity = {
        id: uuid(),
        street: data.address,
        cityId: data.cityId,
      };
      await this.db('address').insert(addressData).transacting(trx);

      const profileData: ProfileEntity = {
        id: uuid(),
        name: data.name,
        userId: userData.id,
        addressId: addressData.id,
      };
      await this.db('profile').insert(profileData).transacting(trx);

      trx.commit();
      return userData.id;
    } catch (err) {
      trx.rollback();
      throw new InternalServerErrorException(err);
    }
  }

  async update(id: string, data: UpdateUserDTO): Promise<void> {
    const trx = await this.db.transaction();
    this.logger.debug({ id, data }, 'UpdateUserDTO');
    try {
      const addressId = await this.db('profile')
        .update({ name: data.name }, ['addressId'])
        .where({ userId: id })
        .transacting(trx);
      if (addressId.length > 0 && addressId[0].addressId) {
        const cityId = await this.db
          .select('id')
          .from('city')
          .where({ name: data.address.city })
          .limit(1)
          .transacting(trx);
        if (cityId.length > 0 && cityId[0].id) {
          await this.db('address')
            .update({ street: data.address.street, cityId: cityId[0].id })
            .where({ id: addressId[0].addressId })
            .transacting(trx);
        }
      }
      trx.commit();
    } catch (err) {
      trx.rollback();
      throw new InternalServerErrorException(err);
    }
  }

  async findOneByID(id: string): Promise<UserEntity | null> {
    const users = await this.db.select().from<UserEntity>('user').where({ id }).limit(1);
    if (users.length > 0) {
      return users[0];
    }
    return null;
  }

  async findOneByUsername(username: string): Promise<UserEntity | null> {
    const users = await this.db.select().from<UserEntity>('user').where({ username }).limit(1);
    if (users.length > 0) {
      return users[0];
    }
    return null;
  }

  async findFullProfileByUserID(id: string): Promise<any> {
    const users = await this.db
      .select('user.id', 'profile.name', 'address.street', 'city.name AS cityName', 'country.name AS countryName')
      .from('user')
      .join('profile', 'profile.userId', 'user.id')
      .join('address', 'profile.addressId', 'address.id')
      .join('city', 'address.cityId', 'city.id')
      .join('country', 'city.countryId', 'country.id')
      .where('user.id', id)
      .groupByRaw('1,2,3,4,5')
      .limit(1);
    if (users.length > 0) {
      const { id, name, street, cityName, countryName } = users[0];
      return {
        id,
        name,
        address: {
          street,
          city: cityName,
          country: countryName,
        },
      };
    }
    return null;
  }

  async findAllUsers(): Promise<any[]> {
    const users = await this.db
      .select('user.id', 'profile.name', 'address.street', 'city.name AS cityName', 'country.name AS countryName')
      .from('user')
      .join('profile', 'profile.userId', 'user.id')
      .join('address', 'profile.addressId', 'address.id')
      .join('city', 'address.cityId', 'city.id')
      .join('country', 'city.countryId', 'country.id')
      .groupByRaw('1,2,3,4,5');
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      address: {
        street: user.street,
        city: user.cityName,
        country: user.countryName,
      },
    }));
  }
}
